/**
 * Cloudflare Workers API Gateway for DomisLink Empire
 * Routes requests to appropriate microservices
 */

// Service endpoints configuration
const SERVICES = {
  auth: 'https://auth-api.domislink.com',
  payments: 'https://payments-api.domislink.com',
  geo: 'https://geo-api.domislink.com',
  notify: 'https://notify-api.domislink.com'
};

// CORS configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Handle CORS preflight
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

// Rate limiting (using KV store)
async function checkRateLimit(request, env) {
  const ip = request.headers.get('CF-Connecting-IP');
  const key = `rate_limit:${ip}`;
  
  if (env.RATE_LIMIT_KV) {
    const count = await env.RATE_LIMIT_KV.get(key);
    if (count && parseInt(count) > 100) {
      return false;
    }
    await env.RATE_LIMIT_KV.put(key, (parseInt(count || 0) + 1).toString(), {
      expirationTtl: 900 // 15 minutes
    });
  }
  
  return true;
}

// Route request to appropriate service
async function routeRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Health check
  if (path === '/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }

  // Determine target service
  let targetService = null;
  let targetPath = path;

  if (path.startsWith('/api/auth/')) {
    targetService = SERVICES.auth;
  } else if (path.startsWith('/api/payments/')) {
    targetService = SERVICES.payments;
  } else if (path.startsWith('/api/geo/')) {
    targetService = SERVICES.geo;
  } else if (path.startsWith('/api/notify/')) {
    targetService = SERVICES.notify;
  } else {
    return new Response(JSON.stringify({
      error: 'Service not found',
      path: path
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }

  // Forward request to target service
  try {
    const targetUrl = `${targetService}${targetPath}${url.search}`;
    
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.clone().arrayBuffer() 
        : null
    });

    const response = await fetch(proxyRequest);
    
    // Clone response and add CORS headers
    const responseHeaders = new Headers(response.headers);
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({
      error: 'Service unavailable',
      message: error.message
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      }
    });
  }
}

// Main handler
export default {
  async fetch(request, env, ctx) {
    try {
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return handleOptions();
      }

      // Check rate limit
      const allowed = await checkRateLimit(request, env);
      if (!allowed) {
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded'
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS
          }
        });
      }

      // Route request
      return await routeRequest(request, env);

    } catch (error) {
      console.error('Gateway error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        }
      });
    }
  }
};
