import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { geoIPService } from '../utils/geoip';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { logger } from '../config/logger';

const router = Router();

const ipSchema = Joi.object({
  ip: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).optional(),
});

const distanceSchema = Joi.object({
  lat1: Joi.number().min(-90).max(90).required(),
  lon1: Joi.number().min(-180).max(180).required(),
  lat2: Joi.number().min(-90).max(90).required(),
  lon2: Joi.number().min(-180).max(180).required(),
  unit: Joi.string().valid('km', 'mi').default('km'),
});

router.get(
  '/location',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = ipSchema.validate(req.query);
    
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const ip = value.ip || geoIPService.extractClientIP(req);
    
    if (!geoIPService.isValidIP(ip)) {
      throw new AppError('Invalid IP address', 400);
    }

    logger.info(`Looking up location for IP: ${ip}`);
    
    const location = await geoIPService.lookupIPWithFallback(ip);
    
    if (!location) {
      throw new AppError('Location not found for the provided IP', 404);
    }

    res.json({
      success: true,
      data: location,
    });
  })
);

router.get(
  '/currency',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = ipSchema.validate(req.query);
    
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const ip = value.ip || geoIPService.extractClientIP(req);
    const location = await geoIPService.lookupIPWithFallback(ip);
    
    if (!location) {
      throw new AppError('Location not found for the provided IP', 404);
    }

    const currency = geoIPService.getCurrencyByCountryCode(location.countryCode);
    const symbol = geoIPService.getCurrencySymbol(location.countryCode);

    res.json({
      success: true,
      data: {
        currency,
        symbol,
        country: location.country,
        countryCode: location.countryCode,
      },
    });
  })
);

router.get(
  '/timezone',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = ipSchema.validate(req.query);
    
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const ip = value.ip || geoIPService.extractClientIP(req);
    const location = await geoIPService.lookupIPWithFallback(ip);
    
    if (!location) {
      throw new AppError('Location not found for the provided IP', 404);
    }

    res.json({
      success: true,
      data: {
        timezone: location.timezone,
        country: location.country,
        countryCode: location.countryCode,
      },
    });
  })
);

router.get(
  '/countries',
  asyncHandler(async (_req: Request, res: Response) => {
    const countries = geoIPService.getAllCountries();
    
    res.json({
      success: true,
      data: {
        countries,
        total: countries.length,
      },
    });
  })
);

router.get(
  '/countries/:code',
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.params;
    const country = geoIPService.getCountryInfo(code.toUpperCase());
    
    if (!country) {
      throw new AppError('Country not found', 404);
    }

    res.json({
      success: true,
      data: country,
    });
  })
);

router.get(
  '/states/:country',
  asyncHandler(async (req: Request, res: Response) => {
    const { country } = req.params;
    
    const states = {
      US: [
        { code: 'AL', name: 'Alabama' },
        { code: 'AK', name: 'Alaska' },
        { code: 'AZ', name: 'Arizona' },
        { code: 'AR', name: 'Arkansas' },
        { code: 'CA', name: 'California' },
        { code: 'CO', name: 'Colorado' },
        { code: 'CT', name: 'Connecticut' },
        { code: 'DE', name: 'Delaware' },
        { code: 'FL', name: 'Florida' },
        { code: 'GA', name: 'Georgia' },
        { code: 'HI', name: 'Hawaii' },
        { code: 'ID', name: 'Idaho' },
        { code: 'IL', name: 'Illinois' },
        { code: 'IN', name: 'Indiana' },
        { code: 'IA', name: 'Iowa' },
        { code: 'KS', name: 'Kansas' },
        { code: 'KY', name: 'Kentucky' },
        { code: 'LA', name: 'Louisiana' },
        { code: 'ME', name: 'Maine' },
        { code: 'MD', name: 'Maryland' },
        { code: 'MA', name: 'Massachusetts' },
        { code: 'MI', name: 'Michigan' },
        { code: 'MN', name: 'Minnesota' },
        { code: 'MS', name: 'Mississippi' },
        { code: 'MO', name: 'Missouri' },
        { code: 'MT', name: 'Montana' },
        { code: 'NE', name: 'Nebraska' },
        { code: 'NV', name: 'Nevada' },
        { code: 'NH', name: 'New Hampshire' },
        { code: 'NJ', name: 'New Jersey' },
        { code: 'NM', name: 'New Mexico' },
        { code: 'NY', name: 'New York' },
        { code: 'NC', name: 'North Carolina' },
        { code: 'ND', name: 'North Dakota' },
        { code: 'OH', name: 'Ohio' },
        { code: 'OK', name: 'Oklahoma' },
        { code: 'OR', name: 'Oregon' },
        { code: 'PA', name: 'Pennsylvania' },
        { code: 'RI', name: 'Rhode Island' },
        { code: 'SC', name: 'South Carolina' },
        { code: 'SD', name: 'South Dakota' },
        { code: 'TN', name: 'Tennessee' },
        { code: 'TX', name: 'Texas' },
        { code: 'UT', name: 'Utah' },
        { code: 'VT', name: 'Vermont' },
        { code: 'VA', name: 'Virginia' },
        { code: 'WA', name: 'Washington' },
        { code: 'WV', name: 'West Virginia' },
        { code: 'WI', name: 'Wisconsin' },
        { code: 'WY', name: 'Wyoming' },
      ],
      NG: [
        { code: 'AB', name: 'Abia' },
        { code: 'AD', name: 'Adamawa' },
        { code: 'AK', name: 'Akwa Ibom' },
        { code: 'AN', name: 'Anambra' },
        { code: 'BA', name: 'Bauchi' },
        { code: 'BY', name: 'Bayelsa' },
        { code: 'BE', name: 'Benue' },
        { code: 'BO', name: 'Borno' },
        { code: 'CR', name: 'Cross River' },
        { code: 'DE', name: 'Delta' },
        { code: 'EB', name: 'Ebonyi' },
        { code: 'ED', name: 'Edo' },
        { code: 'EK', name: 'Ekiti' },
        { code: 'EN', name: 'Enugu' },
        { code: 'GO', name: 'Gombe' },
        { code: 'IM', name: 'Imo' },
        { code: 'JI', name: 'Jigawa' },
        { code: 'KD', name: 'Kaduna' },
        { code: 'KN', name: 'Kano' },
        { code: 'KT', name: 'Katsina' },
        { code: 'KE', name: 'Kebbi' },
        { code: 'KO', name: 'Kogi' },
        { code: 'KW', name: 'Kwara' },
        { code: 'LA', name: 'Lagos' },
        { code: 'NA', name: 'Nasarawa' },
        { code: 'NI', name: 'Niger' },
        { code: 'OG', name: 'Ogun' },
        { code: 'ON', name: 'Ondo' },
        { code: 'OS', name: 'Osun' },
        { code: 'OY', name: 'Oyo' },
        { code: 'PL', name: 'Plateau' },
        { code: 'RI', name: 'Rivers' },
        { code: 'SO', name: 'Sokoto' },
        { code: 'TA', name: 'Taraba' },
        { code: 'YO', name: 'Yobe' },
        { code: 'ZA', name: 'Zamfara' },
        { code: 'FC', name: 'Federal Capital Territory' },
      ],
      CA: [
        { code: 'AB', name: 'Alberta' },
        { code: 'BC', name: 'British Columbia' },
        { code: 'MB', name: 'Manitoba' },
        { code: 'NB', name: 'New Brunswick' },
        { code: 'NL', name: 'Newfoundland and Labrador' },
        { code: 'NS', name: 'Nova Scotia' },
        { code: 'ON', name: 'Ontario' },
        { code: 'PE', name: 'Prince Edward Island' },
        { code: 'QC', name: 'Quebec' },
        { code: 'SK', name: 'Saskatchewan' },
        { code: 'NT', name: 'Northwest Territories' },
        { code: 'NU', name: 'Nunavut' },
        { code: 'YT', name: 'Yukon' },
      ],
    };

    const countryCode = country.toUpperCase();
    const countryStates = states[countryCode as keyof typeof states];
    
    if (!countryStates) {
      throw new AppError('States not available for this country', 404);
    }

    res.json({
      success: true,
      data: {
        country: countryCode,
        states: countryStates,
        total: countryStates.length,
      },
    });
  })
);

router.get(
  '/cities/:state',
  asyncHandler(async (req: Request, res: Response) => {
    const { state } = req.params;
    
    const cities = {
      CA: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'San Jose'],
      NY: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'],
      TX: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
      FL: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Tallahassee', 'Fort Lauderdale'],
      LA: ['Lagos Island', 'Ikeja', 'Lekki', 'Victoria Island', 'Surulere', 'Ikoyi', 'Yaba'],
      AB: ['Umuahia', 'Aba', 'Ohafia', 'Arochukwu', 'Bende'],
    };

    const stateCode = state.toUpperCase();
    const stateCities = cities[stateCode as keyof typeof cities];
    
    if (!stateCities) {
      throw new AppError('Cities not available for this state', 404);
    }

    res.json({
      success: true,
      data: {
        state: stateCode,
        cities: stateCities.map(city => ({ name: city, state: stateCode })),
        total: stateCities.length,
      },
    });
  })
);

router.post(
  '/distance',
  asyncHandler(async (req: Request, res: Response) => {
    const { error, value } = distanceSchema.validate(req.body);
    
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { lat1, lon1, lat2, lon2, unit } = value;
    
    const distance = geoIPService.calculateDistance(lat1, lon1, lat2, lon2, unit);

    res.json({
      success: true,
      data: {
        distance: parseFloat(distance.toFixed(2)),
        unit,
        from: { latitude: lat1, longitude: lon1 },
        to: { latitude: lat2, longitude: lon2 },
      },
    });
  })
);

export default router;
