import geoip from 'geoip-lite';
import NodeCache from 'node-cache';
import axios from 'axios';
import { config } from '../config';
import { logger } from '../config/logger';

const cache = new NodeCache({
  stdTTL: config.cache.ttl,
  checkperiod: config.cache.checkPeriod,
});

export interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  timezone: string;
  latitude: number;
  longitude: number;
  currency?: string;
  isp?: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  continent: string;
}

export interface StateInfo {
  code: string;
  name: string;
  country: string;
}

export interface CityInfo {
  name: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

const CURRENCY_MAP: Record<string, { currency: string; symbol: string }> = {
  US: { currency: 'USD', symbol: '$' },
  CA: { currency: 'CAD', symbol: 'CA$' },
  GB: { currency: 'GBP', symbol: '£' },
  EU: { currency: 'EUR', symbol: '€' },
  NG: { currency: 'NGN', symbol: '₦' },
  JP: { currency: 'JPY', symbol: '¥' },
  CN: { currency: 'CNY', symbol: '¥' },
  IN: { currency: 'INR', symbol: '₹' },
  AU: { currency: 'AUD', symbol: 'A$' },
  BR: { currency: 'BRL', symbol: 'R$' },
  MX: { currency: 'MXN', symbol: 'MX$' },
  ZA: { currency: 'ZAR', symbol: 'R' },
  KE: { currency: 'KES', symbol: 'KSh' },
  GH: { currency: 'GHS', symbol: 'GH₵' },
  EG: { currency: 'EGP', symbol: 'E£' },
};

const COUNTRIES: Record<string, CountryInfo> = {
  US: { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', timezone: 'America/New_York', continent: 'North America' },
  NG: { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', timezone: 'Africa/Lagos', continent: 'Africa' },
  GB: { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', timezone: 'Europe/London', continent: 'Europe' },
  CA: { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'CA$', timezone: 'America/Toronto', continent: 'North America' },
  AU: { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', timezone: 'Australia/Sydney', continent: 'Oceania' },
  DE: { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', timezone: 'Europe/Berlin', continent: 'Europe' },
  FR: { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', timezone: 'Europe/Paris', continent: 'Europe' },
  IN: { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', timezone: 'Asia/Kolkata', continent: 'Asia' },
  BR: { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', timezone: 'America/Sao_Paulo', continent: 'South America' },
  ZA: { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', timezone: 'Africa/Johannesburg', continent: 'Africa' },
  KE: { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', timezone: 'Africa/Nairobi', continent: 'Africa' },
  GH: { code: 'GH', name: 'Ghana', currency: 'GHS', currencySymbol: 'GH₵', timezone: 'Africa/Accra', continent: 'Africa' },
};

export class GeoIPService {
  async lookupIP(ip: string): Promise<GeoLocation | null> {
    const cacheKey = `geo:${ip}`;
    const cached = cache.get<GeoLocation>(cacheKey);

    if (cached) {
      logger.debug(`Cache hit for IP: ${ip}`);
      return cached;
    }

    try {
      const geo = geoip.lookup(ip);
      
      if (!geo) {
        logger.warn(`No geolocation data found for IP: ${ip}`);
        return null;
      }

      const location: GeoLocation = {
        ip,
        country: geo.country,
        countryCode: geo.country,
        region: geo.region || '',
        regionCode: geo.region || '',
        city: geo.city || '',
        timezone: geo.timezone || 'UTC',
        latitude: geo.ll[0],
        longitude: geo.ll[1],
        currency: CURRENCY_MAP[geo.country]?.currency,
      };

      cache.set(cacheKey, location);
      logger.debug(`Cached geolocation for IP: ${ip}`);
      
      return location;
    } catch (error) {
      logger.error('Error looking up IP', { ip, error });
      return null;
    }
  }

  async lookupIPWithFallback(ip: string): Promise<GeoLocation | null> {
    let location = await this.lookupIP(ip);

    if (!location && config.externalApis.ipstackKey) {
      location = await this.lookupWithIPStack(ip);
    }

    if (!location && config.externalApis.ipapiKey) {
      location = await this.lookupWithIPAPI(ip);
    }

    return location;
  }

  private async lookupWithIPStack(ip: string): Promise<GeoLocation | null> {
    try {
      const response = await axios.get(
        `http://api.ipstack.com/${ip}?access_key=${config.externalApis.ipstackKey}`
      );

      const data = response.data;
      return {
        ip,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region_name || '',
        regionCode: data.region_code || '',
        city: data.city || '',
        timezone: data.time_zone?.id || 'UTC',
        latitude: data.latitude,
        longitude: data.longitude,
        currency: data.currency?.code,
      };
    } catch (error) {
      logger.error('IPStack lookup failed', { ip, error });
      return null;
    }
  }

  private async lookupWithIPAPI(ip: string): Promise<GeoLocation | null> {
    try {
      const response = await axios.get(
        `https://ipapi.co/${ip}/json/?key=${config.externalApis.ipapiKey}`
      );

      const data = response.data;
      return {
        ip,
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region || '',
        regionCode: data.region_code || '',
        city: data.city || '',
        timezone: data.timezone || 'UTC',
        latitude: data.latitude,
        longitude: data.longitude,
        currency: data.currency,
      };
    } catch (error) {
      logger.error('IPAPI lookup failed', { ip, error });
      return null;
    }
  }

  getCurrencyByCountryCode(countryCode: string): string {
    return CURRENCY_MAP[countryCode]?.currency || 'USD';
  }

  getCurrencySymbol(countryCode: string): string {
    return CURRENCY_MAP[countryCode]?.symbol || '$';
  }

  getCountryInfo(countryCode: string): CountryInfo | null {
    return COUNTRIES[countryCode] || null;
  }

  getAllCountries(): CountryInfo[] {
    return Object.values(COUNTRIES);
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: 'km' | 'mi' = 'km'
  ): number {
    const R = unit === 'km' ? 6371 : 3959;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  extractClientIP(req: any): string {
    return (
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.headers['x-real-ip'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip ||
      '127.0.0.1'
    );
  }
}

export const geoIPService = new GeoIPService();
