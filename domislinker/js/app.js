// Global app logic
let currentUser = null;
let communities = [];
let properties = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadCommunities();
    loadProperties();
});

// Search properties
function searchProperties() {
    const location = document.getElementById('searchLocation')?.value;
    if (location) {
        window.location.href = `community.html?search=${encodeURIComponent(location)}`;
    }
}

// Load communities data
function loadCommunities() {
    // Mock data - replace with API call
    communities = [
        { id: 1, name: 'Victoria Island', state: 'Lagos', country: 'Nigeria', properties: 45, avgPrice: 250000 },
        { id: 2, name: 'Ikoyi', state: 'Lagos', country: 'Nigeria', properties: 32, avgPrice: 180000 },
        { id: 3, name: 'Lekki', state: 'Lagos', country: 'Nigeria', properties: 67, avgPrice: 120000 },
        { id: 4, name: 'Abuja Central', state: 'FCT', country: 'Nigeria', properties: 28, avgPrice: 200000 },
        { id: 5, name: 'GRA Ikeja', state: 'Lagos', country: 'Nigeria', properties: 19, avgPrice: 150000 },
        { id: 6, name: 'Banana Island', state: 'Lagos', country: 'Nigeria', properties: 12, avgPrice: 500000 }
    ];
    
    renderCommunities();
}

// Load properties data
function loadProperties() {
    // Mock data - replace with API call
    properties = [
        { id: 1, title: '3BR Apartment in Victoria Island', price: 250000, currency: 'NGN', location: 'Victoria Island, Lagos', type: 'apartment', bedrooms: 3, bathrooms: 2 },
        { id: 2, title: 'Luxury Villa in Lekki', price: 450000, currency: 'NGN', location: 'Lekki, Lagos', type: 'house', bedrooms: 5, bathrooms: 4 },
        { id: 3, title: 'Modern Office Space', price: 180000, currency: 'NGN', location: 'Ikoyi, Lagos', type: 'commercial', bedrooms: 0, bathrooms: 2 }
    ];
    
    renderProperties();
}

// Render communities
function renderCommunities() {
    const grid = document.getElementById('communitiesGrid');
    if (!grid) return;
    
    grid.innerHTML = communities.map(community => `
        <div class="community-card" onclick="viewCommunity(${community.id})">
            <h4>${community.name}</h4>
            <p>${community.state}, ${community.country}</p>
            <div class="community-stats">
                <span>🏠 ${community.properties} Properties</span>
                <span>💰 Avg: ${community.currency || 'NGN'}${community.avgPrice?.toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

// Render properties
function renderProperties() {
    const grid = document.getElementById('adsGrid');
    if (!grid) return;
    
    grid.innerHTML = properties.map(property => `
        <div class="ad-card" onclick="viewProperty(${property.id})">
            <h3>${property.title}</h3>
            <div class="price">${property.currency} ${property.price?.toLocaleString()}</div>
            <p>📍 ${property.location}</p>
            <div class="property-details">
                ${property.bedrooms > 0 ? `🛏️ ${property.bedrooms} bed` : ''} 
                ${property.bathrooms > 0 ? `🚿 ${property.bathrooms} bath` : ''}
            </div>
        </div>
    `).join('');
}

// Load all communities for community page
function loadAllCommunities() {
    const grid = document.getElementById('allCommunities');
    if (!grid) return;
    
    renderCommunities();
    populateFilters();
}

// Populate filter dropdowns
function populateFilters() {
    const countryFilter = document.getElementById('countryFilter');
    const stateFilter = document.getElementById('stateFilter');
    
    if (countryFilter) {
        const countries = [...new Set(communities.map(c => c.country))];
        countryFilter.innerHTML = '<option value="">All Countries</option>' + 
            countries.map(country => `<option value="${country}">${country}</option>`).join('');
    }
    
    if (stateFilter) {
        const states = [...new Set(communities.map(c => c.state))];
        stateFilter.innerHTML = '<option value="">All States</option>' + 
            states.map(state => `<option value="${state}">${state}</option>`).join('');
    }
}

// Filter communities
function filterCommunities() {
    const country = document.getElementById('countryFilter')?.value;
    const state = document.getElementById('stateFilter')?.value;
    const search = document.getElementById('communitySearch')?.value.toLowerCase();
    
    let filtered = communities;
    
    if (country) filtered = filtered.filter(c => c.country === country);
    if (state) filtered = filtered.filter(c => c.state === state);
    if (search) filtered = filtered.filter(c => c.name.toLowerCase().includes(search));
    
    const grid = document.getElementById('allCommunities');
    if (grid) {
        grid.innerHTML = filtered.map(community => `
            <div class="community-card" onclick="viewCommunity(${community.id})">
                <h4>${community.name}</h4>
                <p>${community.state}, ${community.country}</p>
                <div class="community-stats">
                    <span>🏠 ${community.properties} Properties</span>
                    <span>💰 Avg: ${community.currency || 'NGN'}${community.avgPrice?.toLocaleString()}</span>
                </div>
            </div>
        `).join('');
    }
}

// View community details
function viewCommunity(communityId) {
    // Navigate to community detail page or show modal
    alert(`Viewing community ${communityId} - Feature coming soon!`);
}

// View property details
function viewProperty(propertyId) {
    // Navigate to property detail page or show modal
    alert(`Viewing property ${propertyId} - Feature coming soon!`);
}

// Payment integration
function initiatePayment(formData) {
    // Load Paystack script if not already loaded
    if (!window.PaystackPop) {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.onload = () => processPaystackPayment(formData);
        document.head.appendChild(script);
    } else {
        processPaystackPayment(formData);
    }
}

function processPaystackPayment(formData) {
    const planPrices = { basic: 500000, premium: 2000000, featured: 5000000 }; // in kobo
    const amount = planPrices[formData.plan] || 500000;
    
    const handler = PaystackPop.setup({
        key: 'pk_test_beb2d6a31e76b83149985e1085496275698b2755',
        email: 'user@domislinker.com',
        amount: amount,
        currency: 'NGN',
        ref: 'DL' + Date.now(),
        callback: function(response) {
            alert('Payment successful! Reference: ' + response.reference);
            // Submit property data to backend
            submitProperty(formData, response.reference);
        },
        onClose: function() {
            alert('Payment cancelled');
        }
    });
    
    handler.openIframe();
}

function submitProperty(formData, paymentRef) {
    // Submit to backend API
    console.log('Submitting property:', formData, 'Payment ref:', paymentRef);
    // Redirect to success page
    window.location.href = 'index.html?success=1';
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('domislinker_user');
    window.location.href = 'index.html';
}