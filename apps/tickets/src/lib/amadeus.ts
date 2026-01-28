import Amadeus from 'amadeus'

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY!,
  clientSecret: process.env.AMADEUS_API_SECRET!,
})

export interface FlightSearchParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate: string
  returnDate?: string
  adults: number
  children?: number
  infants?: number
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'
  currencyCode?: string
}

export interface FlightOffer {
  id: string
  source: string
  price: {
    currency: string
    total: string
    base: string
    grandTotal: string
  }
  itineraries: Array<{
    duration: string
    segments: Array<{
      departure: { iataCode: string; at: string }
      arrival: { iataCode: string; at: string }
      carrierCode: string
      number: string
      duration: string
    }>
  }>
  validatingAirlineCodes: string[]
}

export class AmadeusService {
  static async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    try {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        adults: params.adults,
        children: params.children || 0,
        infants: params.infants || 0,
        travelClass: params.travelClass || 'ECONOMY',
        currencyCode: params.currencyCode || 'USD',
        max: 50
      })

      return response.data as FlightOffer[]
    } catch (error) {
      console.error('Amadeus API Error:', error)
      throw new Error('Failed to search flights')
    }
  }

  static async getAirportSuggestions(keyword: string): Promise<any[]> {
    try {
      const response = await amadeus.referenceData.locations.get({
        keyword,
        subType: 'AIRPORT,CITY'
      })

      return response.data
    } catch (error) {
      console.error('Amadeus Airport Search Error:', error)
      throw new Error('Failed to search airports')
    }
  }

  static async confirmPricing(flightOffers: FlightOffer[]): Promise<any> {
    try {
      const response = await amadeus.shopping.flightOffers.pricing.post(
        JSON.stringify({
          data: {
            type: 'flight-offers-pricing',
            flightOffers
          }
        })
      )

      return response.data
    } catch (error) {
      console.error('Amadeus Pricing Error:', error)
      throw new Error('Failed to confirm pricing')
    }
  }
}

export default AmadeusService