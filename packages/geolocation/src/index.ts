export { default as GeolocationDataManager } from './GeolocationDataManager'

export interface UserLocation {
  country: string
  region: string
  city: string
  coordinates: [number, number]
  timezone: string
  currency: string
}

export interface DataCenter {
  id: string
  location: string
  region: string
  coordinates: [number, number]
  services: string[]
  aiModels: string[]
  status: 'active' | 'maintenance' | 'down'
}