// AI Gate - Frontend mock for content validation
function aiGateCheck(formData) {
    // Basic validation rules (mock AI)
    const suspiciousWords = ['scam', 'fake', 'fraud', 'money back guarantee', 'get rich quick'];
    const requiredFields = ['title', 'price', 'location', 'description'];
    
    // Check required fields
    for (let field of requiredFields) {
        if (!formData[field] || formData[field].trim() === '') {
            alert(`AI Gate: Missing required field - ${field}`);
            return false;
        }
    }
    
    // Check for suspicious content
    const allText = (formData.title + ' ' + formData.description).toLowerCase();
    for (let word of suspiciousWords) {
        if (allText.includes(word)) {
            alert(`AI Gate: Suspicious content detected. Please review your listing.`);
            return false;
        }
    }
    
    // Price validation
    if (formData.price < 1000) {
        alert('AI Gate: Price seems too low. Please verify.');
        return false;
    }
    
    if (formData.price > 10000000) {
        alert('AI Gate: Price seems too high. Please verify.');
        return false;
    }
    
    // Title length check
    if (formData.title.length < 10) {
        alert('AI Gate: Title too short. Please provide more details.');
        return false;
    }
    
    // Description length check
    if (formData.description.length < 20) {
        alert('AI Gate: Description too short. Please provide more details.');
        return false;
    }
    
    // Location validation (basic)
    if (formData.location.length < 5) {
        alert('AI Gate: Please provide a more specific location.');
        return false;
    }
    
    // All checks passed
    console.log('AI Gate: All validations passed');
    return true;
}

// Advanced AI checks (mock)
function aiContentAnalysis(text) {
    // Mock sentiment analysis
    const positiveWords = ['beautiful', 'luxury', 'modern', 'spacious', 'excellent'];
    const negativeWords = ['old', 'small', 'damaged', 'noisy', 'poor'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    const words = text.toLowerCase().split(' ');
    
    words.forEach(word => {
        if (positiveWords.includes(word)) positiveScore++;
        if (negativeWords.includes(word)) negativeScore++;
    });
    
    return {
        sentiment: positiveScore > negativeScore ? 'positive' : 'negative',
        score: positiveScore - negativeScore,
        confidence: Math.min((Math.abs(positiveScore - negativeScore) / words.length) * 100, 100)
    };
}

function aiPriceValidation(price, location, propertyType) {
    // Mock price validation based on location and type
    const priceRanges = {
        'lagos': { apartment: [50000, 500000], house: [100000, 1000000], land: [20000, 200000] },
        'abuja': { apartment: [60000, 600000], house: [120000, 1200000], land: [25000, 250000] },
        'default': { apartment: [30000, 300000], house: [80000, 800000], land: [15000, 150000] }
    };
    
    const locationKey = location.toLowerCase().includes('lagos') ? 'lagos' : 
                       location.toLowerCase().includes('abuja') ? 'abuja' : 'default';
    
    const range = priceRanges[locationKey][propertyType] || priceRanges.default[propertyType];
    
    if (price < range[0] || price > range[1]) {
        return {
            valid: false,
            message: `Price seems unusual for ${propertyType} in ${location}. Expected range: ${range[0].toLocaleString()} - ${range[1].toLocaleString()}`,
            suggestedRange: range
        };
    }
    
    return { valid: true, message: 'Price looks reasonable' };
}

function aiImageValidation(imageFile) {
    // Mock image validation
    if (!imageFile) return { valid: false, message: 'No image provided' };
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
        return { valid: false, message: 'Invalid image format. Use JPEG, PNG, or WebP' };
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
        return { valid: false, message: 'Image too large. Maximum size is 5MB' };
    }
    
    return { valid: true, message: 'Image validation passed' };
}

// Export functions
window.aiGateCheck = aiGateCheck;
window.aiContentAnalysis = aiContentAnalysis;
window.aiPriceValidation = aiPriceValidation;
window.aiImageValidation = aiImageValidation;