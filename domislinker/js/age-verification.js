// Age Verification & COPPA Compliance
class AgeVerificationManager {
    constructor() {
        this.minAge = 18;
        this.init();
    }
    
    init() {
        this.checkAgeVerification();
        this.setupAgeGate();
    }
    
    checkAgeVerification() {
        const ageVerified = localStorage.getItem('domislink-age-verified');
        const verificationDate = localStorage.getItem('domislink-age-verification-date');
        
        // Check if verification is expired (1 year)
        if (verificationDate) {
            const oneYear = 365 * 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(verificationDate) > oneYear) {
                localStorage.removeItem('domislink-age-verified');
                localStorage.removeItem('domislink-age-verification-date');
            }
        }
        
        if (!ageVerified) {
            this.showAgeGate();
        }
    }
    
    showAgeGate() {
        const ageGate = document.createElement('div');
        ageGate.id = 'age-verification-gate';
        ageGate.className = 'age-gate-overlay';
        
        ageGate.innerHTML = `
            <div class="age-gate-modal">
                <div class="age-gate-content">
                    <h2>🔞 Age Verification Required</h2>
                    <p>You must be at least 18 years old to use DomisLinker services.</p>
                    <p>Please confirm your age to continue:</p>
                    
                    <div class="age-verification-form">
                        <div class="birth-date-inputs">
                            <label for="birth-month">Birth Date:</label>
                            <div class="date-inputs">
                                <select id="birth-month" required>
                                    <option value="">Month</option>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                                
                                <select id="birth-day" required>
                                    <option value="">Day</option>
                                    ${this.generateDayOptions()}
                                </select>
                                
                                <select id="birth-year" required>
                                    <option value="">Year</option>
                                    ${this.generateYearOptions()}
                                </select>
                            </div>
                        </div>
                        
                        <div class="age-actions">
                            <button onclick="ageVerifier.verifyAge()" class="btn-verify">
                                ✅ I am 18 or older
                            </button>
                            <button onclick="ageVerifier.underAge()" class="btn-under-age">
                                ❌ I am under 18
                            </button>
                        </div>
                    </div>
                    
                    <div class="age-gate-footer">
                        <p><small>By continuing, you confirm that you are of legal age to enter into binding contracts in your jurisdiction.</small></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(ageGate);
        this.addAgeGateStyles();
        
        // Prevent background interaction
        document.body.style.overflow = 'hidden';
    }
    
    generateDayOptions() {
        let options = '';
        for (let i = 1; i <= 31; i++) {
            const day = i.toString().padStart(2, '0');
            options += `<option value="${day}">${i}</option>`;
        }
        return options;
    }
    
    generateYearOptions() {
        let options = '';
        const currentYear = new Date().getFullYear();
        const minYear = currentYear - 100; // 100 years ago
        const maxYear = currentYear - this.minAge; // 18 years ago
        
        for (let year = maxYear; year >= minYear; year--) {
            options += `<option value="${year}">${year}</option>`;
        }
        return options;
    }
    
    verifyAge() {
        const month = document.getElementById('birth-month').value;
        const day = document.getElementById('birth-day').value;
        const year = document.getElementById('birth-year').value;
        
        if (!month || !day || !year) {
            alert('Please enter your complete birth date.');
            return;
        }
        
        const birthDate = new Date(year, month - 1, day);
        const age = this.calculateAge(birthDate);
        
        if (age >= this.minAge) {
            this.setAgeVerified(true);
            this.hideAgeGate();
            
            // Log age verification
            if (window.errorTracker) {
                window.errorTracker.reportError('Age Verification Completed', {
                    age: age,
                    verified: true,
                    timestamp: new Date().toISOString()
                });
            }
        } else {
            alert(`You must be at least ${this.minAge} years old to use this service.`);
            this.underAge();
        }
    }
    
    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    underAge() {
        // Redirect to age-appropriate content or show message
        document.body.innerHTML = `
            <div class="under-age-message">
                <div class="under-age-content">
                    <h1>🚫 Access Restricted</h1>
                    <p>Sorry, you must be at least 18 years old to access DomisLinker.</p>
                    <p>Please return when you meet the age requirement.</p>
                    
                    <div class="under-age-resources">
                        <h3>Educational Resources:</h3>
                        <ul>
                            <li><a href="https://www.commonsensemedia.org/" target="_blank">Common Sense Media</a></li>
                            <li><a href="https://www.netsmartz.org/" target="_blank">NetSmartz Internet Safety</a></li>
                            <li><a href="https://www.connectsafely.org/" target="_blank">ConnectSafely</a></li>
                        </ul>
                    </div>
                    
                    <button onclick="window.history.back()" class="btn-back">
                        ← Go Back
                    </button>
                </div>
            </div>
            
            <style>
                .under-age-message {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-family: 'Inter', sans-serif;
                    padding: 2rem;
                }
                
                .under-age-content {
                    text-align: center;
                    max-width: 500px;
                    background: rgba(255,255,255,0.1);
                    padding: 3rem;
                    border-radius: 15px;
                    backdrop-filter: blur(10px);
                }
                
                .under-age-content h1 {
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                }
                
                .under-age-content p {
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                    opacity: 0.9;
                }
                
                .under-age-resources {
                    margin: 2rem 0;
                    text-align: left;
                }
                
                .under-age-resources h3 {
                    margin-bottom: 1rem;
                }
                
                .under-age-resources ul {
                    list-style: none;
                    padding: 0;
                }
                
                .under-age-resources li {
                    margin-bottom: 0.5rem;
                }
                
                .under-age-resources a {
                    color: #EEFF00;
                    text-decoration: none;
                }
                
                .under-age-resources a:hover {
                    text-decoration: underline;
                }
                
                .btn-back {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid white;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    margin-top: 2rem;
                    transition: all 0.3s;
                }
                
                .btn-back:hover {
                    background: white;
                    color: #667eea;
                }
            </style>
        `;
        
        // Log under-age attempt
        if (window.errorTracker) {
            window.errorTracker.reportError('Under-age Access Attempt', {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                referrer: document.referrer
            });
        }
    }
    
    setAgeVerified(verified) {
        localStorage.setItem('domislink-age-verified', verified.toString());
        localStorage.setItem('domislink-age-verification-date', Date.now().toString());
    }
    
    hideAgeGate() {
        const ageGate = document.getElementById('age-verification-gate');
        if (ageGate) {
            ageGate.remove();
        }
        document.body.style.overflow = '';
    }
    
    setupAgeGate() {
        // Add age verification check to forms
        this.addAgeCheckToForms();
    }
    
    addAgeCheckToForms() {
        // Add age verification to registration forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.id === 'agentForm' || form.id === 'propertyForm') {
                this.addAgeCheckbox(form);
            }
        });
    }
    
    addAgeCheckbox(form) {
        const ageCheckDiv = document.createElement('div');
        ageCheckDiv.className = 'age-verification-checkbox';
        ageCheckDiv.innerHTML = `
            <label class="age-check-label">
                <input type="checkbox" id="age-confirmation" required>
                <span>I confirm that I am at least 18 years old and agree to the 
                <a href="./terms-of-service.html" target="_blank">Terms of Service</a> and 
                <a href="./privacy-policy.html" target="_blank">Privacy Policy</a>.</span>
            </label>
        `;
        
        // Insert before submit button
        const submitBtn = form.querySelector('button[type="submit"], .submit-btn');
        if (submitBtn) {
            form.insertBefore(ageCheckDiv, submitBtn);
        }
    }
    
    addAgeGateStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .age-gate-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 2rem;
            }
            
            .age-gate-modal {
                background: var(--surface, #ffffff);
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease-out;
            }
            
            .age-gate-content {
                padding: 2rem;
                text-align: center;
            }
            
            .age-gate-content h2 {
                color: var(--primary, #3498db);
                margin-bottom: 1rem;
                font-size: 1.8rem;
            }
            
            .age-gate-content p {
                color: var(--text, #333);
                margin-bottom: 1rem;
                line-height: 1.6;
            }
            
            .age-verification-form {
                margin: 2rem 0;
            }
            
            .birth-date-inputs {
                margin-bottom: 2rem;
            }
            
            .birth-date-inputs label {
                display: block;
                color: var(--text, #333);
                font-weight: 600;
                margin-bottom: 1rem;
            }
            
            .date-inputs {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .date-inputs select {
                padding: 0.75rem;
                border: 1px solid var(--border, #dee2e6);
                border-radius: 6px;
                background: var(--surface, white);
                color: var(--text, #333);
                font-size: 1rem;
                min-width: 80px;
            }
            
            .age-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .btn-verify {
                background: #27ae60;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s;
            }
            
            .btn-verify:hover {
                background: #229954;
                transform: translateY(-2px);
            }
            
            .btn-under-age {
                background: #e74c3c;
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s;
            }
            
            .btn-under-age:hover {
                background: #c0392b;
                transform: translateY(-2px);
            }
            
            .age-gate-footer {
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border, #dee2e6);
            }
            
            .age-gate-footer small {
                color: var(--textSecondary, #666);
                font-size: 0.8rem;
            }
            
            .age-verification-checkbox {
                margin: 1.5rem 0;
                padding: 1rem;
                background: var(--background, #f8f9fa);
                border-radius: 8px;
                border: 1px solid var(--border, #dee2e6);
            }
            
            .age-check-label {
                display: flex;
                align-items: flex-start;
                gap: 0.5rem;
                cursor: pointer;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            .age-check-label input[type="checkbox"] {
                margin-top: 0.2rem;
                flex-shrink: 0;
            }
            
            .age-check-label a {
                color: var(--primary, #3498db);
                text-decoration: none;
            }
            
            .age-check-label a:hover {
                text-decoration: underline;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: scale(0.9) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .age-gate-content {
                    padding: 1.5rem;
                }
                
                .date-inputs {
                    flex-direction: column;
                }
                
                .date-inputs select {
                    min-width: auto;
                }
                
                .age-actions {
                    flex-direction: column;
                }
                
                .btn-verify,
                .btn-under-age {
                    width: 100%;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    // Public method to check if user is verified
    isAgeVerified() {
        return localStorage.getItem('domislink-age-verified') === 'true';
    }
    
    // Method to reset age verification (for testing)
    resetAgeVerification() {
        localStorage.removeItem('domislink-age-verified');
        localStorage.removeItem('domislink-age-verification-date');
        this.checkAgeVerification();
    }
}

// Initialize age verification
let ageVerifier;
document.addEventListener('DOMContentLoaded', function() {
    ageVerifier = new AgeVerificationManager();
    
    // Add global functions
    window.resetAgeVerification = () => ageVerifier.resetAgeVerification();
    window.isAgeVerified = () => ageVerifier.isAgeVerified();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AgeVerificationManager;
} else if (typeof window !== 'undefined') {
    window.AgeVerificationManager = AgeVerificationManager;
}