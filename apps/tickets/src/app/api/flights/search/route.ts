import { NextRequest, NextResponse } from 'next/server'

interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  class?: 'ECONOMY' | 'BUSINESS' | 'FIRST'
}

interface FlightOffer {
  id: string
  price: {
    total: string
    currency: string
  }
  itineraries: any[]
  airline: string
  duration: string
  stops: number
  source: 'amadeus' | 'kiwi'
}

class FlightAPIManager {
  private amadeus: AmadeusAPI
  private kiwi: KiwiAPI

  constructor() {
    this.amadeus = new AmadeusAPI()
    this.kiwi = new KiwiAPI()
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      // Search both APIs simultaneously
      const [amadeusResults, kiwiResults] = await Promise.allSettled([
        this.amadeus.searchFlights({
          originLocationCode: params.origin,
          destinationLocationCode: params.destination,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.passengers,
          travelClass: params.class || 'ECONOMY'
        }),
        this.kiwi.searchFlights({
          fly_from: params.origin,
          fly_to: params.destination,
          date_from: params.departureDate,
          date_to: params.returnDate,
          passengers: params.passengers,
          cabin_class: params.class?.toLowerCase() || 'economy'
        })
      ])

      const allFlights: FlightOffer[] = []

      // Process Amadeus results
      if (amadeusResults.status === 'fulfilled') {
        const amadeusFlights = this.parseAmadeusResults(amadeusResults.value)
        allFlights.push(...amadeusFlights)
      }

      // Process Kiwi results
      if (kiwiResults.status === 'fulfilled') {
        const kiwiFlights = this.parseKiwiResults(kiwiResults.value)
        allFlights.push(...kiwiFlights)
      }

      // Sort by price and remove duplicates
      return this.deduplicateAndSort(allFlights)

    } catch (error) {
      console.error('Flight search error:', error)
      throw new Error('Flight search failed')
    }
  }

  private parseAmadeusResults(data: any): FlightOffer[] {
    if (!data.data) return []

    return data.data.map((offer: any) => ({
      id: `amadeus_${offer.id}`,
      price: {
        total: offer.price.total,
        currency: offer.price.currency
      },
      itineraries: offer.itineraries,
      airline: offer.itineraries[0]?.segments[0]?.carrierCode || 'Unknown',
      duration: offer.itineraries[0]?.duration || 'Unknown',
      stops: (offer.itineraries[0]?.segments?.length || 1) - 1,
      source: 'amadeus' as const
    }))
  }

  private parseKiwiResults(data: any): FlightOffer[] {
    if (!data.data) return []

    return data.data.map((flight: any) => ({
      id: `kiwi_${flight.id}`,
      price: {
        total: flight.price.toString(),
        currency: flight.currency || 'EUR'
      },
      itineraries: flight.route,
      airline: flight.airlines[0] || 'Unknown',
      duration: flight.fly_duration || 'Unknown',
      stops: flight.route?.length - 1 || 0,
      source: 'kiwi' as const
    }))
  }

  private deduplicateAndSort(flights: FlightOffer[]): FlightOffer[] {
    // Remove duplicates based on similar price, airline, and duration
    const unique = flights.filter((flight, index, self) => 
      index === self.findIndex(f => 
        Math.abs(parseFloat(f.price.total) - parseFloat(flight.price.total)) < 10 &&
        f.airline === flight.airline &&
        f.duration === flight.duration
      )
    )

    // Sort by price
    return unique.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total))
  }
}

class AmadeusAPI {
  private apiKey: string
  private apiSecret: string
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.apiKey = process.env.AMADEUS_API_KEY!
    this.apiSecret = process.env.AMADEUS_API_SECRET!
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const response = await fetch('https://api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.apiKey,
        client_secret: this.apiSecret
      })
    })

    if (!response.ok) {
      throw new Error('Amadeus authentication failed')
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // 1 minute buffer

    return this.accessToken
  }

  async searchFlights(params: {
    originLocationCode: string
    destinationLocationCode: string
    departureDate: string
    returnDate?: string
    adults: number
    travelClass?: string
  }) {
    const token = await this.getAccessToken()

    const searchParams = new URLSearchParams({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      max: '50',
      currencyCode: 'USD'
    })

    if (params.returnDate) {
      searchParams.append('returnDate', params.returnDate)
    }

    if (params.travelClass) {
      searchParams.append('travelClass', params.travelClass)
    }

    const response = await fetch(
      `https://api.amadeus.com/v2/shopping/flight-offers?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Amadeus API error: ${response.status}`)
    }

    return response.json()
  }

  async getAirportInfo(keyword: string) {
    const token = await this.getAccessToken()

    const response = await fetch(
      `https://api.amadeus.com/v1/reference-data/locations?keyword=${keyword}&subType=AIRPORT`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    return response.json()
  }
}

class KiwiAPI {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.KIWI_API_KEY!
  }

  async searchFlights(params: {
    fly_from: string
    fly_to: string
    date_from: string
    date_to?: string
    passengers: number
    cabin_class?: string
  }) {
    const searchParams = new URLSearchParams({
      fly_from: params.fly_from,
      fly_to: params.fly_to,
      date_from: params.date_from,
      adults: params.passengers.toString(),
      partner: 'domislink',
      v: '3',
      limit: '50',
      curr: 'USD'
    })

    if (params.date_to) {
      searchParams.append('return_from', params.date_to)
      searchParams.append('return_to', params.date_to)
    }

    if (params.cabin_class) {
      searchParams.append('selected_cabins', params.cabin_class)
    }

    const response = await fetch(
      `https://api.tequila.kiwi.com/v2/search?${searchParams}`,
      {
        headers: {
          'apikey': this.apiKey,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Kiwi API error: ${response.status}`)
    }

    return response.json()
  }

  async getLocations(term: string) {
    const response = await fetch(
      `https://api.tequila.kiwi.com/locations/query?term=${term}&location_types=airport`,
      {
        headers: {
          'apikey': this.apiKey
        }
      }
    )

    return response.json()
  }
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { origin, destination, departureDate, returnDate, passengers, class: travelClass } = body

    if (!origin || !destination || !departureDate || !passengers) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const flightManager = new FlightAPIManager()
    const flights = await flightManager.searchFlights({
      origin,
      destination,
      departureDate,
      returnDate,
      passengers: parseInt(passengers),
      class: travelClass
    })

    return NextResponse.json({
      success: true,
      data: flights,
      count: flights.length,
      sources: ['amadeus', 'kiwi']
    })

  } catch (error) {
    console.error('Flight search API error:', error)
    return NextResponse.json(
      { error: 'Flight search failed' },
      { status: 500 }
    )
  }
}

export { FlightAPIManager }