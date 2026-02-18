// Cloudflare Workers API Routes
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        
        // CORS headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        };
        
        // Handle preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }
        
        try {
            // Health check endpoint
            if (path === '/api/health' || path === '/health' || path === '/') {
                return new Response(JSON.stringify({ 
                    status: 'healthy', 
                    service: 'domislink-empire',
                    timestamp: new Date().toISOString() 
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }
            
            // Database health check (only if DB binding exists)
            if (path === '/api/db/health') {
                if (!env.DB) {
                    return new Response(JSON.stringify({ 
                        status: 'unavailable', 
                        message: 'Database not configured',
                        timestamp: new Date().toISOString() 
                    }), {
                        status: 503,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                const result = await env.DB.prepare("SELECT 1").first();
                return new Response(JSON.stringify({ 
                    status: 'healthy', 
                    timestamp: new Date().toISOString() 
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }
            
            // Generic database query
            if (path === '/api/db/query' && request.method === 'POST') {
                if (!env.DB) {
                    return new Response(JSON.stringify({ error: 'Database not configured' }), {
                        status: 503,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                
                const { sql, params = [] } = await request.json();
                
                // Basic SQL validation
                if (!sql.match(/^(SELECT|INSERT|UPDATE|DELETE)/i)) {
                    return new Response(JSON.stringify({ error: 'Invalid SQL' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                
                const stmt = env.DB.prepare(sql);
                const result = await stmt.bind(...params).all();
                
                return new Response(JSON.stringify({
                    success: true,
                    results: result.results,
                    meta: result.meta
                }), {
                    headers: { 'Content-Type': 'application/json', ...corsHeaders }
                });
            }
            
            // Listings API
            if (path === '/api/listings') {
                if (!env.DB) {
                    return new Response(JSON.stringify({ error: 'Database not configured' }), {
                        status: 503,
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                
                if (request.method === 'GET') {
                    let sql = 'SELECT * FROM listings WHERE status = ? ORDER BY created_at DESC LIMIT 50';
                    let params = ['active'];
                    
                    const stmt = env.DB.prepare(sql);
                    const result = await stmt.bind(...params).all();
                    
                    return new Response(JSON.stringify({
                        success: true,
                        listings: result.results
                    }), {
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
                
                if (request.method === 'POST') {
                    const data = await request.json();
                    const sql = `INSERT INTO listings (title, description, price, location, status, created_at) 
                                VALUES (?, ?, ?, ?, ?, ?)`;
                    
                    const params = [
                        data.title,
                        data.description,
                        data.price,
                        data.location,
                        'active',
                        new Date().toISOString()
                    ];
                    
                    const stmt = env.DB.prepare(sql);
                    const result = await stmt.bind(...params).run();
                    
                    return new Response(JSON.stringify({
                        success: true,
                        id: result.meta.last_row_id
                    }), {
                        headers: { 'Content-Type': 'application/json', ...corsHeaders }
                    });
                }
            }
            
            return new Response(JSON.stringify({ error: 'Not Found' }), { 
                status: 404,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
            
        } catch (error) {
            return new Response(JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
        }
    }
};