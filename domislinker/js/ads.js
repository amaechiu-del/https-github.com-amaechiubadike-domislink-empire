// Ad rendering and management
let selectedPlan = 'basic';

// Template rendering functions
function renderAdTemplate(property, templateType = 'basic') {
    switch(templateType) {
        case 'luxury':
            return renderLuxuryTemplate(property);
        case 'modern':
            return renderModernTemplate(property);
        case 'community':
            return renderCommunityTemplate(property);
        default:
            return renderBasicTemplate(property);
    }
}

function renderBasicTemplate(property) {
    return `
        <div class="ad-template basic">
            <h3>${property.title}</h3>
            <div class="price">${property.currency} ${property.price?.toLocaleString()}</div>
            <p>📍 ${property.location}</p>
            <div class="property-details">
                ${property.bedrooms > 0 ? `🛏️ ${property.bedrooms} bed` : ''} 
                ${property.bathrooms > 0 ? `🚿 ${property.bathrooms} bath` : ''}
                ${property.area ? `📐 ${property.area} sqft` : ''}
            </div>
            <p class="description">${property.description || ''}</p>
        </div>
    `;
}

function renderLuxuryTemplate(property) {
    return `
        <div class="ad-template luxury">
            <div class="luxury-header">
                <div class="luxury-badge">LUXURY</div>
                <h3 class="luxury-title">${property.title}</h3>
                <p class="luxury-location">📍 ${property.location}</p>
            </div>
            <div class="luxury-price">
                <span class="currency">${property.currency}</span>
                <span class="amount">${property.price?.toLocaleString()}</span>
            </div>
            <div class="luxury-features">
                <div class="feature-box">🏠<br/>${property.bedrooms || 0}<br/>Bedrooms</div>
                <div class="feature-box">🚿<br/>${property.bathrooms || 0}<br/>Bathrooms</div>
                <div class="feature-box">📐<br/>${property.area || 'N/A'}<br/>sqft</div>
            </div>
            <p class="luxury-description">${property.description || ''}</p>
        </div>
    `;
}

function renderModernTemplate(property) {
    return `
        <div class="ad-template modern">
            <div class="modern-header">
                <div class="type-badge">${property.type || 'Property'}</div>
                <h3>${property.title}</h3>
                <p>📍 ${property.location}</p>
            </div>
            <div class="modern-price">
                <div class="price-main">${property.currency}${property.price?.toLocaleString()}</div>
                ${property.area ? `<div class="price-per-sqft">${property.currency}${Math.round(property.price / property.area)}/sqft</div>` : ''}
            </div>
            <div class="modern-stats">
                <div class="stat-item">
                    <span class="stat-number">${property.bedrooms || 0}</span>
                    <span class="stat-label">Bedrooms</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${property.bathrooms || 0}</span>
                    <span class="stat-label">Bathrooms</span>
                </div>
                ${property.area ? `
                <div class="stat-item">
                    <span class="stat-number">${property.area}</span>
                    <span class="stat-label">Sq Ft</span>
                </div>` : ''}
            </div>
            <p class="modern-description">${property.description || ''}</p>
        </div>
    `;
}

function renderCommunityTemplate(property) {
    return `
        <div class="ad-template community">
            <div class="community-header">
                <div class="community-name">${property.community || 'Premium Community'}</div>
                <h3>${property.title}</h3>
                <p>📍 ${property.location}</p>
            </div>
            <div class="community-highlight">
                <span>🏠 ${property.type} • ${property.bedrooms} bed • ${property.bathrooms} bath</span>
                <span class="highlight-price">${property.currency}${property.price?.toLocaleString()}</span>
            </div>
            <div class="community-features">
                <h4>Community Features:</h4>
                <div class="features-list">
                    <div class="feature-item">✓ 24/7 Security</div>
                    <div class="feature-item">✓ Swimming Pool</div>
                    <div class="feature-item">✓ Playground</div>
                    <div class="feature-item">✓ Shopping Center</div>
                </div>
            </div>
            <p class="community-description">${property.description || ''}</p>
        </div>
    `;
}

// Ad management functions
function createAd(adData) {
    // Validate ad data
    if (!validateAdData(adData)) {
        return false;
    }
    
    // Add to properties array
    const newAd = {
        id: Date.now(),
        ...adData,
        createdAt: new Date(),
        status: 'active',
        views: 0,
        inquiries: 0
    };
    
    properties.unshift(newAd);
    renderProperties();
    
    return true;
}

function validateAdData(data) {
    const required = ['title', 'price', 'location', 'propertyType'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field} field`);
            return false;
        }
    }
    
    if (isNaN(data.price) || data.price <= 0) {
        alert('Please enter a valid price');
        return false;
    }
    
    return true;
}

function deleteAd(adId) {
    if (confirm('Are you sure you want to delete this ad?')) {
        properties = properties.filter(p => p.id !== adId);
        renderProperties();
        return true;
    }
    return false;
}

function editAd(adId, newData) {
    const adIndex = properties.findIndex(p => p.id === adId);
    if (adIndex !== -1) {
        properties[adIndex] = { ...properties[adIndex], ...newData };
        renderProperties();
        return true;
    }
    return false;
}

// Search and filter functions
function searchAds(query) {
    const filtered = properties.filter(property => 
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.location.toLowerCase().includes(query.toLowerCase()) ||
        property.description?.toLowerCase().includes(query.toLowerCase())
    );
    
    renderFilteredAds(filtered);
}

function filterAdsByPrice(minPrice, maxPrice) {
    const filtered = properties.filter(property => {
        const price = property.price;
        return (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
    });
    
    renderFilteredAds(filtered);
}

function filterAdsByType(propertyType) {
    const filtered = propertyType ? 
        properties.filter(property => property.type === propertyType) : 
        properties;
    
    renderFilteredAds(filtered);
}

function renderFilteredAds(filteredAds) {
    const grid = document.getElementById('adsGrid');
    if (!grid) return;
    
    grid.innerHTML = filteredAds.map(property => `
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

// Plan selection
function selectPlan(plan) {
    selectedPlan = plan;
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.plan-card').classList.add('selected');
}

// Export functions for global use
window.renderAdTemplate = renderAdTemplate;
window.createAd = createAd;
window.deleteAd = deleteAd;
window.editAd = editAd;
window.searchAds = searchAds;
window.filterAdsByPrice = filterAdsByPrice;
window.filterAdsByType = filterAdsByType;
window.selectPlan = selectPlan;