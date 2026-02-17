# DomisLink Geolocation Service

A high-performance geolocation microservice for the DomisLink Empire platform, providing IP-based geolocation, currency detection, timezone information, and distance calculations.

## Features

- 🌍 **IP Geolocation**: Detect location from IP addresses with multiple fallback providers
- 💰 **Currency Detection**: Automatic currency detection based on country
- ⏰ **Timezone Information**: Get timezone data for any location
- 📍 **Distance Calculations**: Calculate distances between coordinates
- 🗺️ **Location Data**: Countries, states, and cities listings
- ⚡ **High Performance**: Built-in caching with NodeCache
- 🔒 **Security**: Rate limiting, CORS, Helmet protection
- 📊 **Monitoring**: Health checks and metrics endpoints
- 🐳 **Docker Ready**: Multi-stage Dockerfile for production

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js
- **Geolocation**: geoip-lite with fallback to IPStack/IPAPI
- **Caching**: node-cache
- **Database**: Supabase (optional)
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f geolocation-service

# Stop service
docker-compose down
```

## Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=3002
HOST=0.0.0.0

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL=3600               # 1 hour
CACHE_CHECK_PERIOD=600       # 10 minutes

# Supabase (Optional)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External APIs (Optional - for fallback)
IPSTACK_API_KEY=your-ipstack-key
IPAPI_API_KEY=your-ipapi-key

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

## API Documentation

### Base URL
```
http://localhost:3002/api/geo
```

### Endpoints

#### 1. Get Location from IP

```http
GET /api/geo/location?ip=8.8.8.8
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ip": "8.8.8.8",
    "country": "United States",
    "countryCode": "US",
    "region": "California",
    "regionCode": "CA",
    "city": "Mountain View",
    "timezone": "America/Los_Angeles",
    "latitude": 37.386,
    "longitude": -122.0838,
    "currency": "USD"
  }
}
```

**Notes:**
- If `ip` parameter is not provided, uses the client's IP address
- Supports both IPv4 and IPv6 addresses
- Results are cached for better performance

#### 2. Get Currency by Location

```http
GET /api/geo/currency?ip=8.8.8.8
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currency": "USD",
    "symbol": "$",
    "country": "United States",
    "countryCode": "US"
  }
}
```

#### 3. Get Timezone

```http
GET /api/geo/timezone?ip=8.8.8.8
```

**Response:**
```json
{
  "success": true,
  "data": {
    "timezone": "America/Los_Angeles",
    "country": "United States",
    "countryCode": "US"
  }
}
```

#### 4. List All Countries

```http
GET /api/geo/countries
```

**Response:**
```json
{
  "success": true,
  "data": {
    "countries": [
      {
        "code": "US",
        "name": "United States",
        "currency": "USD",
        "currencySymbol": "$",
        "timezone": "America/New_York",
        "continent": "North America"
      },
      {
        "code": "NG",
        "name": "Nigeria",
        "currency": "NGN",
        "currencySymbol": "₦",
        "timezone": "Africa/Lagos",
        "continent": "Africa"
      }
    ],
    "total": 12
  }
}
```

#### 5. Get Country Information

```http
GET /api/geo/countries/US
```

**Response:**
```json
{
  "success": true,
  "data": {
    "code": "US",
    "name": "United States",
    "currency": "USD",
    "currencySymbol": "$",
    "timezone": "America/New_York",
    "continent": "North America"
  }
}
```

#### 6. List States in Country

```http
GET /api/geo/states/US
```

**Response:**
```json
{
  "success": true,
  "data": {
    "country": "US",
    "states": [
      { "code": "AL", "name": "Alabama" },
      { "code": "CA", "name": "California" },
      { "code": "NY", "name": "New York" }
    ],
    "total": 50
  }
}
```

**Supported Countries:**
- US (United States) - 50 states
- NG (Nigeria) - 36 states + FCT
- CA (Canada) - 13 provinces/territories

#### 7. List Cities in State

```http
GET /api/geo/cities/CA
```

**Response:**
```json
{
  "success": true,
  "data": {
    "state": "CA",
    "cities": [
      { "name": "Los Angeles", "state": "CA" },
      { "name": "San Francisco", "state": "CA" },
      { "name": "San Diego", "state": "CA" }
    ],
    "total": 6
  }
}
```

#### 8. Calculate Distance Between Coordinates

```http
POST /api/geo/distance
Content-Type: application/json

{
  "lat1": 37.7749,
  "lon1": -122.4194,
  "lat2": 34.0522,
  "lon2": -118.2437,
  "unit": "km"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "distance": 559.12,
    "unit": "km",
    "from": { "latitude": 37.7749, "longitude": -122.4194 },
    "to": { "latitude": 34.0522, "longitude": -118.2437 }
  }
}
```

**Parameters:**
- `lat1`, `lon1`: Starting coordinates
- `lat2`, `lon2`: Ending coordinates
- `unit`: Distance unit - `"km"` or `"mi"` (default: `"km"`)

### Health & Monitoring

#### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "geolocation-service",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

#### Metrics

```http
GET /metrics
```

**Response:**
```json
{
  "service": "geolocation-service",
  "uptime": {
    "seconds": 3600.5,
    "formatted": "1h 0m 0s"
  },
  "requests": {
    "total": 1500,
    "errors": 15,
    "errorRate": "1.00%"
  },
  "memory": {
    "rss": "45.23 MB",
    "heapTotal": "20.12 MB",
    "heapUsed": "15.34 MB",
    "external": "2.45 MB"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "Stack trace (development only)"
  }
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `404`: Not Found (resource not found)
- `429`: Too Many Requests (rate limit exceeded)
- `500`: Internal Server Error

## Caching

The service implements intelligent caching:

- **IP Lookups**: Cached for 1 hour (configurable via `CACHE_TTL`)
- **Cache Storage**: In-memory using node-cache
- **Cache Keys**: `geo:{ip}` format
- **Auto-cleanup**: Every 10 minutes (configurable via `CACHE_CHECK_PERIOD`)

## Rate Limiting

Default rate limits:
- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Headers**: Includes `X-RateLimit-*` headers in responses

## Performance

- **Average Response Time**: < 10ms (cached)
- **Cold Start**: < 50ms (first lookup)
- **Memory Usage**: ~50MB (typical)
- **Concurrent Requests**: Supports high concurrency with caching

## Security Features

- ✅ Helmet.js for HTTP headers security
- ✅ CORS protection with configurable origins
- ✅ Rate limiting per IP
- ✅ Input validation with Joi
- ✅ No SQL injection risks (read-only operations)
- ✅ Error messages don't leak sensitive info

## Deployment

### Oracle Cloud

```bash
# Build Docker image
docker build -t domislink/geolocation-service:latest .

# Push to registry
docker push domislink/geolocation-service:latest

# Deploy with Docker Compose
docker-compose -f docker-compose.yml up -d
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: geolocation-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: geolocation-service
  template:
    metadata:
      labels:
        app: geolocation-service
    spec:
      containers:
      - name: geolocation-service
        image: domislink/geolocation-service:latest
        ports:
        - containerPort: 3002
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
```

## Development

### Project Structure

```
geolocation-service/
├── src/
│   ├── config/
│   │   ├── index.ts          # Configuration
│   │   └── logger.ts         # Winston logger
│   ├── middleware/
│   │   └── errorHandler.ts   # Error handling
│   ├── routes/
│   │   └── geo.ts            # Geolocation routes
│   ├── utils/
│   │   └── geoip.ts          # GeoIP utilities
│   └── index.ts              # Main server
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
# TypeScript compilation
npm run build

# Output in dist/ folder
ls dist/
```

### Testing

```bash
# Run tests
npm test

# With coverage
npm test -- --coverage
```

### Linting

```bash
# ESLint
npm run lint

# Auto-fix
npm run lint -- --fix

# Format with Prettier
npm run format
```

## Troubleshooting

### Issue: Service not starting

**Solution:**
1. Check environment variables: `cat .env`
2. Verify port availability: `lsof -i :3002`
3. Check logs: `docker-compose logs geolocation-service`

### Issue: Inaccurate geolocation data

**Solution:**
1. Add external API keys (IPStack or IPAPI) for better accuracy
2. Update geoip-lite database: `npm update geoip-lite`

### Issue: High memory usage

**Solution:**
1. Reduce `CACHE_TTL` in `.env`
2. Lower `CACHE_CHECK_PERIOD` for more frequent cleanup
3. Monitor with `/metrics` endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: [domislink/geolocation-service](https://github.com/domislink/geolocation-service/issues)
- Email: support@domislink.com

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- IP geolocation with caching
- Currency and timezone detection
- Distance calculations
- Docker support
- Health and metrics endpoints
