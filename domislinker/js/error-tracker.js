// Error Tracking & Deep Linking System
class ErrorTracker {
    constructor() {
        this.errors = [];
        this.deepLinks = new Map();
        this.init();
    }
    
    init() {
        this.setupErrorHandlers();
        this.setupDeepLinkHandlers();
        this.setupNavigationTracking();
        this.setup404Handler();
        this.trackPageLoad();
    }
    
    setupErrorHandlers() {
        // Global JavaScript errors
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });
        
        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || event.reason,
                stack: event.reason?.stack,
                timestamp: new Date().toISOString(),
                url: window.location.href
            });
        });
        
        // Network errors
        this.trackNetworkErrors();
    }
    
    trackNetworkErrors() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    this.logError({
                        type: 'Network Error',
                        message: `HTTP ${response.status}: ${response.statusText}`,
                        url: args[0],
                        status: response.status,
                        timestamp: new Date().toISOString()
                    });
                }
                return response;
            } catch (error) {
                this.logError({
                    type: 'Fetch Error',
                    message: error.message,
                    url: args[0],
                    timestamp: new Date().toISOString()
                });
                throw error;
            }
        };
    }
    
    setup404Handler() {
        // Check for broken links
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link && link.href) {
                const url = new URL(link.href, window.location.origin);
                
                // Check if it's an internal link
                if (url.origin === window.location.origin) {
                    // Validate internal links
                    this.validateInternalLink(url.pathname, link);
                }
            }
        });
        
        // Check all links on page load
        this.validateAllLinks();
    }
    
    validateAllLinks() {
        const links = document.querySelectorAll('a[href]');
        const internalLinks = [];
        const externalLinks = [];
        const brokenLinks = [];
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            
            if (!href || href === '#') {
                brokenLinks.push({
                    element: link,
                    href: href,
                    text: link.textContent.trim(),
                    issue: 'Empty or hash-only href'
                });
                return;
            }
            
            try {
                const url = new URL(href, window.location.origin);
                
                if (url.origin === window.location.origin) {
                    internalLinks.push({ element: link, url: url.pathname });
                } else {
                    externalLinks.push({ element: link, url: href });
                }
            } catch (error) {
                brokenLinks.push({
                    element: link,
                    href: href,
                    text: link.textContent.trim(),
                    issue: 'Invalid URL format'
                });
            }
        });
        
        // Log findings
        this.logLinkAnalysis({
            internal: internalLinks.length,
            external: externalLinks.length,
            broken: brokenLinks.length,
            brokenLinks: brokenLinks,
            timestamp: new Date().toISOString()
        });
        
        // Validate internal links
        internalLinks.forEach(({ element, url }) => {
            this.validateInternalLink(url, element);
        });
    }
    
    validateInternalLink(pathname, linkElement) {
        const validPaths = [
            '/',
            '/index.html',
            '/community.html',
            '/post-ad.html',
            '/agent.html',
            '/dashboard.html',
            '/ai-promo-engine.html'
        ];
        
        if (!validPaths.includes(pathname)) {
            this.logError({
                type: '404 Link Error',
                message: `Broken internal link: ${pathname}`,
                linkText: linkElement?.textContent?.trim(),
                linkHref: linkElement?.href,
                currentPage: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    setupDeepLinkHandlers() {
        // Handle URL parameters and fragments
        const urlParams = new URLSearchParams(window.location.search);
        const fragment = window.location.hash;
        
        // Track deep link usage
        if (urlParams.toString() || fragment) {
            this.logDeepLink({
                type: 'Deep Link Access',
                params: Object.fromEntries(urlParams),
                fragment: fragment,
                fullUrl: window.location.href,
                timestamp: new Date().toISOString()
            });
        }
        
        // Handle specific deep link patterns
        this.handleSpecificDeepLinks(urlParams, fragment);
    }
    
    handleSpecificDeepLinks(params, fragment) {
        // Handle success/error states
        if (params.get('success')) {
            this.showNotification('Operation completed successfully!', 'success');
        }
        
        if (params.get('error')) {
            this.showNotification(`Error: ${params.get('error')}`, 'error');
        }
        
        // Handle fragment navigation
        if (fragment) {
            const targetElement = document.querySelector(fragment);
            if (targetElement) {
                setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
                this.logError({
                    type: 'Fragment Not Found',
                    message: `Fragment ${fragment} not found on page`,
                    url: window.location.href,
                    timestamp: new Date().toISOString()
                });
            }
        }
    }
    
    setupNavigationTracking() {
        // Track page navigation
        let lastUrl = window.location.href;
        
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                this.logNavigation({
                    type: 'Navigation',
                    from: lastUrl,
                    to: window.location.href,
                    timestamp: new Date().toISOString()
                });
                lastUrl = window.location.href;
            }
        });
        
        observer.observe(document, { subtree: true, childList: true });
        
        // Track back/forward navigation
        window.addEventListener('popstate', (event) => {
            this.logNavigation({
                type: 'Browser Navigation',
                url: window.location.href,
                state: event.state,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    trackPageLoad() {
        // Track page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            this.logPerformance({
                type: 'Page Load',
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart,
                url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
    }
    
    logError(error) {
        this.errors.push(error);
        console.error('🐛 Error Tracked:', error);
        
        // Store in localStorage for persistence
        this.saveToStorage('domislink-errors', this.errors);
        
        // Send to analytics if available
        this.sendToAnalytics('error', error);
        
        // Show user-friendly error message for critical errors
        if (error.type === 'JavaScript Error' || error.type === 'Unhandled Promise Rejection') {
            this.showErrorNotification(error);
        }
    }
    
    logDeepLink(linkData) {
        const key = `${linkData.type}-${Date.now()}`;
        this.deepLinks.set(key, linkData);
        console.log('🔗 Deep Link Tracked:', linkData);
        
        this.saveToStorage('domislink-deeplinks', Array.from(this.deepLinks.entries()));
        this.sendToAnalytics('deeplink', linkData);
    }
    
    logNavigation(navData) {
        console.log('🧭 Navigation Tracked:', navData);
        this.sendToAnalytics('navigation', navData);
    }
    
    logPerformance(perfData) {
        console.log('⚡ Performance Tracked:', perfData);
        this.sendToAnalytics('performance', perfData);
    }
    
    logLinkAnalysis(analysis) {
        console.log('🔍 Link Analysis:', analysis);
        
        if (analysis.broken > 0) {
            console.warn(`Found ${analysis.broken} broken links:`, analysis.brokenLinks);
        }
        
        this.sendToAnalytics('link-analysis', analysis);
    }
    
    saveToStorage(key, data) {
        try {
            // Keep only last 100 entries to prevent storage overflow
            const limitedData = Array.isArray(data) ? data.slice(-100) : data;
            localStorage.setItem(key, JSON.stringify(limitedData));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }
    
    sendToAnalytics(type, data) {
        // Mock analytics - replace with real analytics service
        if (window.gtag) {
            window.gtag('event', type, {
                custom_parameter: JSON.stringify(data)
            });
        }
        
        // Could also send to custom analytics endpoint
        // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ type, data }) });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    showErrorNotification(error) {
        const message = `Something went wrong. Error has been logged for debugging.`;
        this.showNotification(message, 'error');
    }
    
    // Public methods for manual error reporting
    reportError(message, details = {}) {
        this.logError({
            type: 'Manual Report',
            message: message,
            details: details,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }
    
    getErrorReport() {
        return {
            errors: this.errors,
            deepLinks: Array.from(this.deepLinks.entries()),
            summary: {
                totalErrors: this.errors.length,
                errorTypes: [...new Set(this.errors.map(e => e.type))],
                totalDeepLinks: this.deepLinks.size,
                lastError: this.errors[this.errors.length - 1],
                generatedAt: new Date().toISOString()
            }
        };
    }
    
    clearErrors() {
        this.errors = [];
        this.deepLinks.clear();
        localStorage.removeItem('domislink-errors');
        localStorage.removeItem('domislink-deeplinks');
        console.log('🧹 Error tracking data cleared');
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize error tracker
let errorTracker;
document.addEventListener('DOMContentLoaded', function() {
    errorTracker = new ErrorTracker();
    
    // Add global error reporting function
    window.reportError = (message, details) => errorTracker.reportError(message, details);
    window.getErrorReport = () => errorTracker.getErrorReport();
    window.clearErrors = () => errorTracker.clearErrors();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorTracker;
} else if (typeof window !== 'undefined') {
    window.ErrorTracker = ErrorTracker;
}