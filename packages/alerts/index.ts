import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'
import TelegramBot from 'node-telegram-bot-api'
import nodemailer from 'nodemailer'

// Pricing Plans
export const ALERT_PRICING = {
  FREE: {
    name: 'Free',
    price: 0,
    sms: 0,
    email: 5,
    telegram: 10,
    whatsapp: 0,
    features: ['Basic email alerts', 'Telegram notifications']
  },
  BASIC: {
    name: 'Basic',
    price: 5, // $5/month
    sms: 50,
    email: 200,
    telegram: 500,
    whatsapp: 20,
    features: ['SMS alerts', 'Email alerts', 'Telegram', 'WhatsApp', 'Real Estate alerts', 'Flight price alerts']
  },
  PRO: {
    name: 'Pro',
    price: 15, // $15/month
    sms: 200,
    email: 1000,
    telegram: 2000,
    whatsapp: 100,
    features: ['All Basic features', 'Priority alerts', 'Custom alert rules', 'Multiple properties tracking']
  },
  PREMIUM: {
    name: 'Premium',
    price: 30, // $30/month
    sms: 500,
    email: 5000,
    telegram: 10000,
    whatsapp: 300,
    features: ['All Pro features', 'Instant alerts', 'API access', 'Bulk notifications', 'Analytics dashboard']
  }
}

export interface AlertConfig {
  userId: string
  type: 'REAL_ESTATE' | 'FLIGHT_PRICE' | 'FLIGHT_STATUS' | 'TEACHMASTER' | 'SYSTEM'
  channels: ('SMS' | 'EMAIL' | 'TELEGRAM' | 'WHATSAPP')[]
  criteria: Record<string, any>
  frequency: 'INSTANT' | 'HOURLY' | 'DAILY' | 'WEEKLY'
  active: boolean
}

export interface AlertMessage {
  title: string
  message: string
  data?: Record<string, any>
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
}

export class AlertService {
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  private twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )
  
  private telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false })
  
  private emailTransporter = nodemailer.createTransporter({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY!
    }
  })

  // Real Estate Alerts
  async createRealEstateAlert(userId: string, criteria: {
    location: string
    minPrice?: number
    maxPrice?: number
    propertyType?: string
    bedrooms?: number
    channels: ('SMS' | 'EMAIL' | 'TELEGRAM' | 'WHATSAPP')[]
  }) {
    const { data, error } = await this.supabase
      .from('alert_configs')
      .insert({
        user_id: userId,
        type: 'REAL_ESTATE',
        channels: criteria.channels,
        criteria: {
          location: criteria.location,
          min_price: criteria.minPrice,
          max_price: criteria.maxPrice,
          property_type: criteria.propertyType,
          bedrooms: criteria.bedrooms
        },
        frequency: 'INSTANT',
        active: true
      })

    if (error) throw error
    return data
  }

  // Flight Price Alerts
  async createFlightPriceAlert(userId: string, criteria: {
    origin: string
    destination: string
    departureDate: string
    maxPrice: number
    channels: ('SMS' | 'EMAIL' | 'TELEGRAM' | 'WHATSAPP')[]
  }) {
    const { data, error } = await this.supabase
      .from('alert_configs')
      .insert({
        user_id: userId,
        type: 'FLIGHT_PRICE',
        channels: criteria.channels,
        criteria,
        frequency: 'HOURLY',
        active: true
      })

    if (error) throw error
    return data
  }

  // Flight Status Alerts
  async createFlightStatusAlert(userId: string, criteria: {
    flightNumber: string
    date: string
    channels: ('SMS' | 'EMAIL' | 'TELEGRAM' | 'WHATSAPP')[]
  }) {
    const { data, error } = await this.supabase
      .from('alert_configs')
      .insert({
        user_id: userId,
        type: 'FLIGHT_STATUS',
        channels: criteria.channels,
        criteria,
        frequency: 'INSTANT',
        active: true
      })

    if (error) throw error
    return data
  }

  // Send SMS Alert
  async sendSMS(to: string, message: AlertMessage) {
    try {
      const result = await this.twilioClient.messages.create({
        body: `${message.title}\n\n${message.message}`,
        from: process.env.TWILIO_PHONE!,
        to: to
      })
      
      await this.logAlert('SMS', to, message, 'SUCCESS', result.sid)
      return result
    } catch (error) {
      await this.logAlert('SMS', to, message, 'FAILED', error.message)
      throw error
    }
  }

  // Send Email Alert
  async sendEmail(to: string, message: AlertMessage) {
    try {
      const result = await this.emailTransporter.sendMail({
        from: 'alerts@domislink.com',
        to: to,
        subject: message.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">${message.title}</h2>
            <p style="color: #666; line-height: 1.6;">${message.message}</p>
            ${message.data ? `<pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${JSON.stringify(message.data, null, 2)}</pre>` : ''}
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              DomisLink Empire Alert Service<br>
              <a href="https://domislink.com/alerts/unsubscribe">Unsubscribe</a>
            </p>
          </div>
        `
      })
      
      await this.logAlert('EMAIL', to, message, 'SUCCESS', result.messageId)
      return result
    } catch (error) {
      await this.logAlert('EMAIL', to, message, 'FAILED', error.message)
      throw error
    }
  }

  // Send Telegram Alert
  async sendTelegram(chatId: string, message: AlertMessage) {
    try {
      const text = `🚨 *${message.title}*\n\n${message.message}`
      const result = await this.telegramBot.sendMessage(chatId, text, { parse_mode: 'Markdown' })
      
      await this.logAlert('TELEGRAM', chatId, message, 'SUCCESS', result.message_id.toString())
      return result
    } catch (error) {
      await this.logAlert('TELEGRAM', chatId, message, 'FAILED', error.message)
      throw error
    }
  }

  // Send WhatsApp Alert (placeholder - requires WhatsApp Business API)
  async sendWhatsApp(to: string, message: AlertMessage) {
    try {
      // WhatsApp Business API integration would go here
      // For now, we'll use Twilio's WhatsApp service
      const result = await this.twilioClient.messages.create({
        body: `${message.title}\n\n${message.message}`,
        from: 'whatsapp:+14155238886', // Twilio Sandbox number
        to: `whatsapp:${to}`
      })
      
      await this.logAlert('WHATSAPP', to, message, 'SUCCESS', result.sid)
      return result
    } catch (error) {
      await this.logAlert('WHATSAPP', to, message, 'FAILED', error.message)
      throw error
    }
  }

  // Multi-channel alert sender
  async sendAlert(userId: string, message: AlertMessage, channels: ('SMS' | 'EMAIL' | 'TELEGRAM' | 'WHATSAPP')[]) {
    const { data: user } = await this.supabase
      .from('users')
      .select('phone, email, telegram_chat_id, whatsapp_number, alert_plan')
      .eq('id', userId)
      .single()

    if (!user) throw new Error('User not found')

    const plan = ALERT_PRICING[user.alert_plan || 'FREE']
    const results = []

    for (const channel of channels) {
      try {
        switch (channel) {
          case 'SMS':
            if (user.phone && plan.sms > 0) {
              await this.sendSMS(user.phone, message)
              await this.decrementUsage(userId, 'sms')
            }
            break
          case 'EMAIL':
            if (user.email && plan.email > 0) {
              await this.sendEmail(user.email, message)
              await this.decrementUsage(userId, 'email')
            }
            break
          case 'TELEGRAM':
            if (user.telegram_chat_id && plan.telegram > 0) {
              await this.sendTelegram(user.telegram_chat_id, message)
              await this.decrementUsage(userId, 'telegram')
            }
            break
          case 'WHATSAPP':
            if (user.whatsapp_number && plan.whatsapp > 0) {
              await this.sendWhatsApp(user.whatsapp_number, message)
              await this.decrementUsage(userId, 'whatsapp')
            }
            break
        }
        results.push({ channel, status: 'SUCCESS' })
      } catch (error) {
        results.push({ channel, status: 'FAILED', error: error.message })
      }
    }

    return results
  }

  // Auto-monitoring hooks
  async setupAutoHooks() {
    // Real Estate Price Changes
    setInterval(async () => {
      await this.checkRealEstatePriceChanges()
    }, 5 * 60 * 1000) // Every 5 minutes

    // Flight Price Changes
    setInterval(async () => {
      await this.checkFlightPriceChanges()
    }, 15 * 60 * 1000) // Every 15 minutes

    // Flight Status Updates
    setInterval(async () => {
      await this.checkFlightStatusUpdates()
    }, 2 * 60 * 1000) // Every 2 minutes
  }

  private async checkRealEstatePriceChanges() {
    const { data: alerts } = await this.supabase
      .from('alert_configs')
      .select('*')
      .eq('type', 'REAL_ESTATE')
      .eq('active', true)

    for (const alert of alerts || []) {
      // Check for new listings matching criteria
      const { data: newListings } = await this.supabase
        .from('listings')
        .select('*')
        .ilike('location', `%${alert.criteria.location}%`)
        .gte('price', alert.criteria.min_price || 0)
        .lte('price', alert.criteria.max_price || 999999999)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString())

      if (newListings && newListings.length > 0) {
        for (const listing of newListings) {
          await this.sendAlert(alert.user_id, {
            title: '🏠 New Property Alert',
            message: `New property found in ${listing.location}!\n\nPrice: $${listing.price.toLocaleString()}\nType: ${listing.property_type}\nBedrooms: ${listing.bedrooms}`,
            data: listing,
            priority: 'HIGH'
          }, alert.channels)
        }
      }
    }
  }

  private async checkFlightPriceChanges() {
    const { data: alerts } = await this.supabase
      .from('alert_configs')
      .select('*')
      .eq('type', 'FLIGHT_PRICE')
      .eq('active', true)

    for (const alert of alerts || []) {
      // Check current flight prices using Amadeus API
      try {
        const response = await fetch(`/api/flights/search?origin=${alert.criteria.origin}&destination=${alert.criteria.destination}&departureDate=${alert.criteria.departureDate}`)
        const { data: flights } = await response.json()

        const cheapestFlight = flights?.reduce((min, flight) => 
          parseFloat(flight.price.total) < parseFloat(min.price.total) ? flight : min
        )

        if (cheapestFlight && parseFloat(cheapestFlight.price.total) <= alert.criteria.maxPrice) {
          await this.sendAlert(alert.user_id, {
            title: '✈️ Flight Price Alert',
            message: `Price drop found!\n\n${alert.criteria.origin} → ${alert.criteria.destination}\nPrice: ${cheapestFlight.price.currency} ${cheapestFlight.price.total}\nAirline: ${cheapestFlight.validatingAirlineCodes[0]}`,
            data: cheapestFlight,
            priority: 'HIGH'
          }, alert.channels)
        }
      } catch (error) {
        console.error('Flight price check error:', error)
      }
    }
  }

  private async checkFlightStatusUpdates() {
    const { data: alerts } = await this.supabase
      .from('alert_configs')
      .select('*')
      .eq('type', 'FLIGHT_STATUS')
      .eq('active', true)

    for (const alert of alerts || []) {
      // Check flight status using flight tracking API
      // Implementation would depend on flight tracking service
    }
  }

  private async decrementUsage(userId: string, channel: string) {
    await this.supabase
      .from('alert_usage')
      .upsert({
        user_id: userId,
        month: new Date().toISOString().slice(0, 7),
        [channel]: 1
      }, {
        onConflict: 'user_id,month',
        ignoreDuplicates: false
      })
  }

  private async logAlert(channel: string, recipient: string, message: AlertMessage, status: string, reference?: string) {
    await this.supabase
      .from('alert_logs')
      .insert({
        channel,
        recipient,
        title: message.title,
        message: message.message,
        status,
        reference,
        created_at: new Date().toISOString()
      })
  }
}

export default AlertService