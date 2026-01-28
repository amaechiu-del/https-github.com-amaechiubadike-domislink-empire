import { NextRequest, NextResponse } from 'next/server'
import AlertService, { ALERT_PRICING } from '@domislink/alerts'

const alertService = new AlertService()

// GET /api/alerts - Get user's alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's alert configurations
    const { data: alerts, error } = await alertService['supabase']
      .from('alert_configs')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ alerts })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/alerts - Create new alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, criteria, channels } = body

    if (!userId || !type || !criteria || !channels) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let result
    switch (type) {
      case 'REAL_ESTATE':
        result = await alertService.createRealEstateAlert(userId, criteria)
        break
      case 'FLIGHT_PRICE':
        result = await alertService.createFlightPriceAlert(userId, criteria)
        break
      case 'FLIGHT_STATUS':
        result = await alertService.createFlightStatusAlert(userId, criteria)
        break
      default:
        return NextResponse.json({ error: 'Invalid alert type' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/alerts - Delete alert
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('alertId')
    const userId = searchParams.get('userId')

    if (!alertId || !userId) {
      return NextResponse.json({ error: 'Alert ID and User ID required' }, { status: 400 })
    }

    const { error } = await alertService['supabase']
      .from('alert_configs')
      .delete()
      .eq('id', alertId)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}