// =============================================
// DOMISLINK GEOLOCATION
// Auto-detect location, currency, language
// =============================================

export interface GeoLocation {
  ip: string
  country: string
  countryCode: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  currency: string
  currencySymbol: string
  language: string
  callingCode: string
}

// Currency mapping by country code
export const COUNTRY_CURRENCIES: Record<string, { code: string; symbol: string }> = {
  NG: { code: 'NGN', symbol: '₦' },
  US: { code: 'USD', symbol: '$' },
  GB: { code: 'GBP', symbol: '£' },
  EU: { code: 'EUR', symbol: '€' },
  GH: { code: 'GHS', symbol: '₵' },
  KE: { code: 'KES', symbol: 'KSh' },
  ZA: { code: 'ZAR', symbol: 'R' },
  EG: { code: 'EGP', symbol: 'E£' },
  AE: { code: 'AED', symbol: 'د.إ' },
  SA: { code: 'SAR', symbol: '﷼' },
  IN: { code: 'INR', symbol: '₹' },
  CN: { code: 'CNY', symbol: '¥' },
  JP: { code: 'JPY', symbol: '¥' },
  KR: { code: 'KRW', symbol: '₩' },
  BR: { code: 'BRL', symbol: 'R$' },
  MX: { code: 'MXN', symbol: '$' },
  CA: { code: 'CAD', symbol: 'C$' },
  AU: { code: 'AUD', symbol: 'A$' },
  RU: { code: 'RUB', symbol: '₽' },
  TR: { code: 'TRY', symbol: '₺' },
  // Add more as needed
}

// Default language by country
export const COUNTRY_LANGUAGES: Record<string, string> = {
  NG: 'en',
  US: 'en',
  GB: 'en',
  GH: 'en',
  KE: 'sw',
  ZA: 'en',
  EG: 'ar',
  AE: 'ar',
  SA: 'ar',
  IN: 'hi',
  CN: 'zh',
  JP: 'ja',
  KR: 'ko',
  BR: 'pt',
  MX: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  RU: 'ru',
  TR: 'tr',
  ES: 'es',
  PT: 'pt',
  // Add more
}

// Detect location from IP (using ipinfo.io or similar)
export async function detectLocation(): Promise<GeoLocation | null> {
  try {
    // Try ipinfo.io (free tier: 50k/month)
    const response = await fetch('https://ipinfo.io/json?token=' + process.env.IPINFO_TOKEN)
    const data = await response.json()
    
    const [lat, lng] = (data.loc || '0,0').split(',').map(Number)
    const currency = COUNTRY_CURRENCIES[data.country] || { code: 'USD', symbol: '$' }
    const language = COUNTRY_LANGUAGES[data.country] || 'en'
    
    return {
      ip: data.ip,
      country: data.country_name || data.country,
      countryCode: data.country,
      region: data.region,
      city: data.city,
      latitude: lat,
      longitude: lng,
      timezone: data.timezone,
      currency: currency.code,
      currencySymbol: currency.symbol,
      language,
      callingCode: data.country_calling_code || '',
    }
  } catch (error) {
    console.error('Geolocation detection failed:', error)
    return null
  }
}

// Browser geolocation (more precise, requires permission)
export function getBrowserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => resolve(null),
      { timeout: 5000, enableHighAccuracy: false }
    )
  })
}

// Calculate distance between two points (in km)
export function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Format price with detected currency
export function formatLocalPrice(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get nearby communities based on coordinates
export function isNearby(
  userLat: number, userLng: number,
  targetLat: number, targetLng: number,
  radiusKm: number = 50
): boolean {
  return calculateDistance(userLat, userLng, targetLat, targetLng) <= radiusKm
}

// Export
export default {
  detectLocation,
  getBrowserLocation,
  calculateDistance,
  formatLocalPrice,
  isNearby,
  COUNTRY_CURRENCIES,
  COUNTRY_LANGUAGES,
}
