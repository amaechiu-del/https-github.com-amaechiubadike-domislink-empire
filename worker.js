// Simple Cloudflare Worker - Health Check API
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    // Handle OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    // Health check response
    return new Response(JSON.stringify({
      status: 'healthy',
      service: 'domislink-empire',
      timestamp: new Date().toISOString(),
      path: url.pathname
    }), { headers });
  }
};
