// Agent functionality
let selectedAgentPlan = 'starter';
let agentData = null;

// Agent registration
function registerAgent() {
    const formData = {
        name: document.getElementById('agentName')?.value,
        email: document.getElementById('agentEmail')?.value,
        phone: document.getElementById('agentPhone')?.value,
        location: document.getElementById('agentLocation')?.value,
        experience: document.getElementById('experience')?.value,
        license: document.getElementById('license')?.value,
        bio: document.getElementById('agentBio')?.value,
        plan: selectedAgentPlan
    };
    
    if (!validateAgentData(formData)) return;
    
    // Mock registration - replace with API call
    agentData = {
        id: Date.now(),
        ...formData,
        registeredAt: new Date(),
        status: 'active',
        commission: 0,
        listings: [],
        inquiries: []
    };
    
    localStorage.setItem('domislinker_agent', JSON.stringify(agentData));
    alert('Registration successful! Redirecting to dashboard...');
    window.location.href = 'dashboard.html';
}

function validateAgentData(data) {
    const required = ['name', 'email', 'phone', 'location', 'experience', 'bio'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            alert(`Please fill in the ${field} field`);
            return false;
        }
    }
    
    if (!isValidEmail(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function selectAgentPlan(plan) {
    selectedAgentPlan = plan;
    document.querySelectorAll('.plan-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.plan-card').classList.add('selected');
}

// Dashboard functions
function loadAgentDashboard() {
    const storedAgent = localStorage.getItem('domislinker_agent');
    if (!storedAgent) {
        window.location.href = 'agent.html';
        return;
    }
    
    agentData = JSON.parse(storedAgent);
    updateDashboardStats();
    loadAgentListings();
    loadAgentInquiries();
}

function updateDashboardStats() {
    if (!agentData) return;
    
    document.getElementById('activeListings').textContent = agentData.listings?.length || 0;
    document.getElementById('totalViews').textContent = calculateTotalViews();
    document.getElementById('inquiries').textContent = agentData.inquiries?.length || 0;
    document.getElementById('commission').textContent = `$${agentData.commission || 0}`;
}

function calculateTotalViews() {
    if (!agentData.listings) return 0;
    return agentData.listings.reduce((total, listing) => total + (listing.views || 0), 0);
}

function loadAgentListings() {
    const container = document.getElementById('agentListings');
    if (!container || !agentData.listings) return;
    
    if (agentData.listings.length === 0) {
        container.innerHTML = '<p>No listings yet. <a href="post-ad.html">Post your first property</a></p>';
        return;
    }
    
    container.innerHTML = agentData.listings.map(listing => `
        <div class="listing-item">
            <h4>${listing.title}</h4>
            <p>${listing.currency} ${listing.price?.toLocaleString()}</p>
            <p>📍 ${listing.location}</p>
            <div class="listing-stats">
                <span>👁️ ${listing.views || 0} views</span>
                <span>📞 ${listing.inquiries || 0} inquiries</span>
            </div>
            <div class="listing-actions">
                <button onclick="editListing(${listing.id})">Edit</button>
                <button onclick="deleteListing(${listing.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function loadAgentInquiries() {
    const container = document.getElementById('recentInquiries');
    if (!container) return;
    
    // Mock inquiries data
    const inquiries = [
        { id: 1, property: '3BR Apartment', client: 'John Doe', message: 'Interested in viewing', date: '2025-01-09' },
        { id: 2, property: 'Luxury Villa', client: 'Jane Smith', message: 'What is the final price?', date: '2025-01-08' }
    ];
    
    if (inquiries.length === 0) {
        container.innerHTML = '<p>No inquiries yet.</p>';
        return;
    }
    
    container.innerHTML = inquiries.map(inquiry => `
        <div class="inquiry-item">
            <h5>${inquiry.property}</h5>
            <p><strong>${inquiry.client}</strong></p>
            <p>${inquiry.message}</p>
            <small>${inquiry.date}</small>
            <button onclick="respondToInquiry(${inquiry.id})">Respond</button>
        </div>
    `).join('');
}

function editListing(listingId) {
    alert(`Edit listing ${listingId} - Feature coming soon!`);
}

function deleteListing(listingId) {
    if (confirm('Are you sure you want to delete this listing?')) {
        agentData.listings = agentData.listings.filter(l => l.id !== listingId);
        localStorage.setItem('domislinker_agent', JSON.stringify(agentData));
        loadAgentListings();
        updateDashboardStats();
    }
}

function respondToInquiry(inquiryId) {
    alert(`Respond to inquiry ${inquiryId} - Feature coming soon!`);
}

// Export functions
window.registerAgent = registerAgent;
window.selectAgentPlan = selectAgentPlan;
window.loadAgentDashboard = loadAgentDashboard;
window.editListing = editListing;
window.deleteListing = deleteListing;
window.respondToInquiry = respondToInquiry;