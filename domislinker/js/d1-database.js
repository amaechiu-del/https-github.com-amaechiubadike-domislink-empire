# Cloudflare D1 Database Configuration
class D1DatabaseManager {
    constructor() {
        this.dbName = 'domislink-db';
        this.apiEndpoint = '/api/db';
        this.init();
    }
    
    init() {
        this.setupDatabaseConnection();
    }
    
    async setupDatabaseConnection() {
        // D1 database operations are handled via Cloudflare Workers
        // This client-side manager interfaces with the Workers API
        this.isConnected = await this.testConnection();
    }
    
    async testConnection() {
        try {
            const response = await fetch(`${this.apiEndpoint}/health`);
            return response.ok;
        } catch (error) {
            console.error('D1 Database connection failed:', error);
            return false;
        }
    }
    
    // Generic database query method
    async query(sql, params = []) {
        try {
            const response = await fetch(`${this.apiEndpoint}/query`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql, params })
            });
            
            if (!response.ok) {
                throw new Error(`Database query failed: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }
    
    // Listings operations
    async getListings(filters = {}) {
        const { location, minPrice, maxPrice, propertyType } = filters;
        let sql = 'SELECT * FROM listings WHERE status = ?';
        let params = ['active'];
        
        if (location) {
            sql += ' AND location LIKE ?';
            params.push(`%${location}%`);
        }
        
        if (minPrice) {
            sql += ' AND price >= ?';
            params.push(minPrice);
        }
        
        if (maxPrice) {
            sql += ' AND price <= ?';
            params.push(maxPrice);
        }
        
        if (propertyType) {
            sql += ' AND property_type = ?';
            params.push(propertyType);
        }
        
        sql += ' ORDER BY created_at DESC LIMIT 50';
        
        return await this.query(sql, params);
    }
    
    async createListing(listingData) {
        const sql = `
            INSERT INTO listings (title, description, price, currency, property_type, 
                                bedrooms, bathrooms, area, location, community_id, 
                                user_id, status, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            listingData.title,
            listingData.description,
            listingData.price,
            listingData.currency,
            listingData.property_type,
            listingData.bedrooms,
            listingData.bathrooms,
            listingData.area,
            listingData.location,
            listingData.community_id,
            listingData.user_id,
            'active',
            listingData.expires_at
        ];
        
        return await this.query(sql, params);
    }
    
    // Communities operations
    async getCommunities() {
        const sql = 'SELECT * FROM communities ORDER BY name';
        return await this.query(sql);
    }
    
    async createCommunity(communityData) {
        const sql = `
            INSERT INTO communities (name, state, country, description)
            VALUES (?, ?, ?, ?)
        `;
        
        const params = [
            communityData.name,
            communityData.state,
            communityData.country,
            communityData.description
        ];
        
        return await this.query(sql, params);
    }
    
    // Agents operations
    async createAgent(agentData) {
        const sql = `
            INSERT INTO agents (name, email, phone, location, experience, 
                              license, bio, plan, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            agentData.name,
            agentData.email,
            agentData.phone,
            agentData.location,
            agentData.experience,
            agentData.license,
            agentData.bio,
            agentData.plan,
            'active'
        ];
        
        return await this.query(sql, params);
    }
    
    // Analytics operations
    async logEvent(eventData) {
        const sql = `
            INSERT INTO analytics (event_type, event_data, user_id, session_id, timestamp)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const params = [
            eventData.type,
            JSON.stringify(eventData.data),
            eventData.user_id,
            eventData.session_id,
            new Date().toISOString()
        ];
        
        return await this.query(sql, params);
    }
}

// Initialize D1 database manager
let d1Manager;
document.addEventListener('DOMContentLoaded', () => {
    d1Manager = new D1DatabaseManager();
    window.d1Manager = d1Manager;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = D1DatabaseManager;
} else if (typeof window !== 'undefined') {
    window.D1DatabaseManager = D1DatabaseManager;
}