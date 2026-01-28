-- D1 Database Schema for DomisLinker
-- Run this in Cloudflare D1 console or via wrangler d1 execute

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    status TEXT DEFAULT 'active'
);

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    description TEXT,
    total_listings INTEGER DEFAULT 0,
    avg_price REAL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    property_type TEXT NOT NULL,
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    area REAL DEFAULT 0,
    location TEXT NOT NULL,
    community_id INTEGER,
    user_id TEXT DEFAULT 'anonymous',
    status TEXT DEFAULT 'active',
    expires_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (community_id) REFERENCES communities(id)
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    location TEXT NOT NULL,
    experience TEXT NOT NULL,
    license TEXT,
    bio TEXT NOT NULL,
    plan TEXT DEFAULT 'starter',
    commission REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    event_data TEXT,
    user_id TEXT,
    session_id TEXT,
    timestamp TEXT NOT NULL
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    currency TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    reference TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    listing_id INTEGER,
    agent_id INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (agent_id) REFERENCES agents(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at);
CREATE INDEX IF NOT EXISTS idx_communities_country_state ON communities(country, state);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- Insert sample communities
INSERT OR IGNORE INTO communities (name, state, country, description, created_at, updated_at) VALUES
('Victoria Island', 'Lagos', 'Nigeria', 'Premium business and residential district', datetime('now'), datetime('now')),
('Ikoyi', 'Lagos', 'Nigeria', 'Upscale residential area', datetime('now'), datetime('now')),
('Lekki', 'Lagos', 'Nigeria', 'Modern planned city', datetime('now'), datetime('now')),
('Abuja Central', 'FCT', 'Nigeria', 'Federal capital territory center', datetime('now'), datetime('now')),
('GRA Ikeja', 'Lagos', 'Nigeria', 'Government reserved area', datetime('now'), datetime('now')),
('Banana Island', 'Lagos', 'Nigeria', 'Luxury artificial island', datetime('now'), datetime('now'));

-- Insert sample listings
INSERT OR IGNORE INTO listings (title, description, price, currency, property_type, bedrooms, bathrooms, area, location, community_id, status, expires_at, created_at, updated_at) VALUES
('3BR Apartment in Victoria Island', 'Modern 3-bedroom apartment with ocean view', 250000, 'NGN', 'apartment', 3, 2, 1200, 'Victoria Island, Lagos', 1, 'active', datetime('now', '+30 days'), datetime('now'), datetime('now')),
('Luxury Villa in Lekki', '5-bedroom villa with swimming pool and garden', 450000, 'NGN', 'house', 5, 4, 3500, 'Lekki, Lagos', 3, 'active', datetime('now', '+30 days'), datetime('now'), datetime('now')),
('Modern Office Space', 'Commercial office space in prime location', 180000, 'NGN', 'commercial', 0, 2, 800, 'Ikoyi, Lagos', 2, 'active', datetime('now', '+30 days'), datetime('now'), datetime('now'));