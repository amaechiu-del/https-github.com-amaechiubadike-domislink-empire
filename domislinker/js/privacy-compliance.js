// Cookie Consent & Privacy Compliance Manager
class PrivacyComplianceManager {
    constructor() {
        this.consentData = this.getStoredConsent();
        this.requiredCookies = ['essential'];
        this.optionalCookies = ['analytics', 'marketing', 'preferences'];
        this.init();
    }
    
    init() {
        this.checkConsentStatus();
        this.setupPrivacyControls();
        this.addComplianceStyles();
    }
    
    checkConsentStatus() {
        if (!this.consentData || this.isConsentExpired()) {
            this.showCookieBanner();
        } else {
            this.applyCookieSettings();
        }
    }
    
    isConsentExpired() {
        if (!this.consentData.timestamp) return true;
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        return Date.now() - this.consentData.timestamp > oneYear;
    }
    
    showCookieBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        
        banner.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-text">
                    <h3>🍪 We use cookies</h3>
                    <p>We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. You can manage your preferences below.</p>
                </div>
                <div class="cookie-actions">
                    <button onclick="privacyManager.acceptAll()" class="btn-accept-all">Accept All</button>
                    <button onclick="privacyManager.showPreferences()" class="btn-preferences">Manage Preferences</button>
                    <button onclick="privacyManager.rejectAll()" class="btn-reject">Reject All</button>
                </div>
            </div>
            <div class="cookie-links">
                <a href="/privacy-policy.html">Privacy Policy</a> | 
                <a href="/cookie-policy.html">Cookie Policy</a>
            </div>
        `;
        
        document.body.appendChild(banner);
    }
    
    showPreferences() {
        const modal = document.createElement('div');
        modal.id = 'cookie-preferences-modal';
        modal.className = 'cookie-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Cookie Preferences</h3>
                    <button onclick="privacyManager.closePreferences()" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="cookie-category">
                        <div class="category-header">
                            <h4>Essential Cookies</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" checked disabled>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Required for basic site functionality. Cannot be disabled.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <h4>Analytics Cookies</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" id="analytics-toggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Help us understand how visitors interact with our website.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <h4>Marketing Cookies</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" id="marketing-toggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Used to deliver personalized advertisements.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <h4>Preference Cookies</h4>
                            <label class="toggle-switch">
                                <input type="checkbox" id="preferences-toggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Remember your settings and preferences.</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="privacyManager.savePreferences()" class="btn-save">Save Preferences</button>
                    <button onclick="privacyManager.closePreferences()" class="btn-cancel">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.loadCurrentPreferences();
    }
    
    loadCurrentPreferences() {
        if (this.consentData) {
            document.getElementById('analytics-toggle').checked = this.consentData.analytics || false;
            document.getElementById('marketing-toggle').checked = this.consentData.marketing || false;
            document.getElementById('preferences-toggle').checked = this.consentData.preferences || false;
        }
    }
    
    acceptAll() {
        this.saveConsent({
            essential: true,
            analytics: true,
            marketing: true,
            preferences: true,
            timestamp: Date.now()
        });
        this.hideCookieBanner();
        this.applyCookieSettings();
    }
    
    rejectAll() {
        this.saveConsent({
            essential: true,
            analytics: false,
            marketing: false,
            preferences: false,
            timestamp: Date.now()
        });
        this.hideCookieBanner();
        this.applyCookieSettings();
    }
    
    savePreferences() {
        const preferences = {
            essential: true,
            analytics: document.getElementById('analytics-toggle').checked,
            marketing: document.getElementById('marketing-toggle').checked,
            preferences: document.getElementById('preferences-toggle').checked,
            timestamp: Date.now()
        };
        
        this.saveConsent(preferences);
        this.closePreferences();
        this.hideCookieBanner();
        this.applyCookieSettings();
    }
    
    saveConsent(consent) {
        this.consentData = consent;
        localStorage.setItem('domislink-cookie-consent', JSON.stringify(consent));
        
        // Trigger consent change event
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
            detail: consent
        }));
    }
    
    getStoredConsent() {
        try {
            const stored = localStorage.getItem('domislink-cookie-consent');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    }
    
    applyCookieSettings() {
        if (!this.consentData) return;
        
        // Apply analytics
        if (this.consentData.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Apply marketing
        if (this.consentData.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
        
        // Apply preferences
        if (this.consentData.preferences) {
            this.enablePreferences();
        }
    }
    
    enableAnalytics() {
        // Enable Google Analytics or other analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }
    
    disableAnalytics() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }
    
    enableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
    }
    
    disableMarketing() {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied'
            });
        }
    }
    
    enablePreferences() {
        // Enable preference-based features
        console.log('Preferences enabled');
    }
    
    hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.remove();
        }
    }
    
    closePreferences() {
        const modal = document.getElementById('cookie-preferences-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    setupPrivacyControls() {
        // Add privacy control button to page
        const privacyButton = document.createElement('button');
        privacyButton.id = 'privacy-settings-btn';
        privacyButton.className = 'privacy-settings-btn';
        privacyButton.innerHTML = '🔒 Privacy Settings';
        privacyButton.onclick = () => this.showPreferences();
        
        // Add to footer or fixed position
        const footer = document.querySelector('.footer') || document.body;
        footer.appendChild(privacyButton);
    }
    
    addComplianceStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: var(--surface, #ffffff);
                border-top: 1px solid var(--border, #dee2e6);
                box-shadow: 0 -4px 20px var(--shadow, rgba(0,0,0,0.1));
                padding: 1.5rem;
                z-index: 10000;
                animation: slideUp 0.3s ease-out;
            }
            
            .cookie-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1200px;
                margin: 0 auto;
                gap: 2rem;
            }
            
            .cookie-text h3 {
                margin: 0 0 0.5rem 0;
                color: var(--text, #333);
            }
            
            .cookie-text p {
                margin: 0;
                color: var(--textSecondary, #666);
                font-size: 0.9rem;
            }
            
            .cookie-actions {
                display: flex;
                gap: 1rem;
                flex-shrink: 0;
            }
            
            .cookie-actions button {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s;
            }
            
            .btn-accept-all {
                background: var(--primary, #3498db);
                color: white;
            }
            
            .btn-preferences {
                background: var(--surface, white);
                color: var(--text, #333);
                border: 1px solid var(--border, #dee2e6);
            }
            
            .btn-reject {
                background: var(--textSecondary, #666);
                color: white;
            }
            
            .cookie-links {
                text-align: center;
                margin-top: 1rem;
                font-size: 0.8rem;
            }
            
            .cookie-links a {
                color: var(--primary, #3498db);
                text-decoration: none;
            }
            
            .cookie-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                padding: 2rem;
            }
            
            .modal-content {
                background: var(--surface, white);
                border-radius: 10px;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid var(--border, #dee2e6);
            }
            
            .modal-header h3 {
                margin: 0;
                color: var(--text, #333);
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--textSecondary, #666);
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .cookie-category {
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--border, #dee2e6);
            }
            
            .cookie-category:last-child {
                border-bottom: none;
            }
            
            .category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .category-header h4 {
                margin: 0;
                color: var(--text, #333);
            }
            
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: 0.3s;
                border-radius: 24px;
            }
            
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.3s;
                border-radius: 50%;
            }
            
            input:checked + .slider {
                background-color: var(--primary, #3498db);
            }
            
            input:checked + .slider:before {
                transform: translateX(26px);
            }
            
            input:disabled + .slider {
                background-color: var(--primary, #3498db);
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .modal-footer {
                padding: 1.5rem;
                border-top: 1px solid var(--border, #dee2e6);
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            
            .btn-save {
                background: var(--primary, #3498db);
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .btn-cancel {
                background: var(--surface, white);
                color: var(--text, #333);
                padding: 0.75rem 1.5rem;
                border: 1px solid var(--border, #dee2e6);
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .privacy-settings-btn {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: var(--primary, #3498db);
                color: white;
                border: none;
                padding: 0.75rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                box-shadow: 0 4px 12px var(--shadow, rgba(0,0,0,0.2));
                z-index: 1000;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            
            @media (max-width: 768px) {
                .cookie-content {
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .cookie-actions {
                    width: 100%;
                    justify-content: center;
                }
                
                .cookie-actions button {
                    flex: 1;
                    min-width: 0;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    // GDPR Data Subject Rights
    exportUserData() {
        const userData = {
            cookieConsent: this.consentData,
            localStorage: this.getAllLocalStorageData(),
            sessionData: this.getAllSessionData(),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(userData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'domislink-user-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    deleteUserData() {
        if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
            // Clear all localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('domislink-')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear session storage
            sessionStorage.clear();
            
            // Reset cookie consent
            this.consentData = null;
            
            alert('Your data has been deleted successfully.');
            window.location.reload();
        }
    }
    
    getAllLocalStorageData() {
        const data = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('domislink-')) {
                data[key] = localStorage.getItem(key);
            }
        });
        return data;
    }
    
    getAllSessionData() {
        const data = {};
        Object.keys(sessionStorage).forEach(key => {
            data[key] = sessionStorage.getItem(key);
        });
        return data;
    }
}

// Initialize privacy compliance
let privacyManager;
document.addEventListener('DOMContentLoaded', function() {
    privacyManager = new PrivacyComplianceManager();
    
    // Add global privacy functions
    window.exportMyData = () => privacyManager.exportUserData();
    window.deleteMyData = () => privacyManager.deleteUserData();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrivacyComplianceManager;
} else if (typeof window !== 'undefined') {
    window.PrivacyComplianceManager = PrivacyComplianceManager;
}