import { NextRequest, NextResponse } from 'next/server'
import AmadeusService from '../../../lib/amadeus'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword')

    if (!keyword || keyword.length < 2) {
      return NextResponse.json(
        { error: 'Keyword must be at least 2 characters long' },
        { status: 400 }
      )
    }

    const airports = await AmadeusService.getAirportSuggestions(keyword)
    
    return NextResponse.json({
      success: true,
      data: airports
    })

  } catch (error) {
    console.error('Airport search error:', error)
    return NextResponse.json(
      { error: 'Failed to search airports' },
      { status: 500 }
    )
  }
}