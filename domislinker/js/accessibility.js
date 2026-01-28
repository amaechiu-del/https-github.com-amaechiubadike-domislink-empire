// Accessibility Compliance Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.addAccessibilityFeatures();
        this.setupKeyboardNavigation();
        this.addAriaLabels();
        this.setupFocusManagement();
        this.addSkipLinks();
        this.setupColorContrastToggle();
        this.addScreenReaderSupport();
    }
    
    addAccessibilityFeatures() {
        // Add accessibility toolbar
        const toolbar = document.createElement('div');
        toolbar.id = 'accessibility-toolbar';
        toolbar.className = 'accessibility-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-label', 'Accessibility Tools');
        
        toolbar.innerHTML = `
            <button class="accessibility-toggle" onclick="accessibilityManager.toggleToolbar()" 
                    aria-label="Toggle accessibility tools" title="Accessibility Tools">
                ♿ A11Y
            </button>
            <div class="accessibility-menu" id="accessibility-menu" role="menu">
                <button onclick="accessibilityManager.increaseFontSize()" role="menuitem" 
                        aria-label="Increase font size" title="Increase Font Size">
                    🔍+ Font Size
                </button>
                <button onclick="accessibilityManager.decreaseFontSize()" role="menuitem"
                        aria-label="Decrease font size" title="Decrease Font Size">
                    🔍- Font Size
                </button>
                <button onclick="accessibilityManager.toggleHighContrast()" role="menuitem"
                        aria-label="Toggle high contrast mode" title="High Contrast">
                    🎨 High Contrast
                </button>
                <button onclick="accessibilityManager.toggleScreenReader()" role="menuitem"
                        aria-label="Toggle screen reader mode" title="Screen Reader Mode">
                    📢 Screen Reader
                </button>
                <button onclick="accessibilityManager.toggleKeyboardNav()" role="menuitem"
                        aria-label="Toggle keyboard navigation highlights" title="Keyboard Navigation">
                    ⌨️ Keyboard Nav
                </button>
                <button onclick="accessibilityManager.resetAccessibility()" role="menuitem"
                        aria-label="Reset all accessibility settings" title="Reset Settings">
                    🔄 Reset
                </button>
            </div>
        `;
        
        document.body.appendChild(toolbar);
        this.addAccessibilityStyles();
    }
    
    addSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;
        
        document.body.insertBefore(skipLinks, document.body.firstChild);
        
        // Add main content landmark if not exists
        if (!document.getElementById('main-content')) {
            const main = document.querySelector('main') || 
                         document.querySelector('.container') || 
                         document.body.children[1];
            if (main) {
                main.id = 'main-content';
                main.setAttribute('role', 'main');
            }
        }
    }
    
    setupKeyboardNavigation() {
        // Add keyboard event listeners
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
            
            // Escape key to close modals/menus
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Enter/Space for button activation
            if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute('role') === 'button') {
                e.preventDefault();
                e.target.click();
            }
        });
        
        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Make all interactive elements focusable
        this.makeFocusable();
    }
    
    makeFocusable() {
        // Add tabindex to interactive elements without it
        const interactiveElements = document.querySelectorAll(
            'button, a, input, select, textarea, [onclick], [role="button"], [role="link"]'
        );
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex') && !element.disabled) {
                element.setAttribute('tabindex', '0');
            }
        });
    }
    
    addAriaLabels() {
        // Add ARIA labels to common elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            const text = button.textContent.trim() || button.title || 'Button';
            button.setAttribute('aria-label', text);
        });
        
        // Add ARIA labels to form inputs
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`) ||
                         input.closest('label') ||
                         input.previousElementSibling;
            
            if (label && label.textContent) {
                input.setAttribute('aria-label', label.textContent.trim());
            } else if (input.placeholder) {
                input.setAttribute('aria-label', input.placeholder);
            }
        });
        
        // Add ARIA landmarks
        this.addLandmarks();
    }
    
    addLandmarks() {
        // Add navigation landmark
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
            nav.setAttribute('aria-label', 'Main navigation');
        }
        
        // Add banner landmark to header
        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }
        
        // Add contentinfo landmark to footer
        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
        
        // Add search landmark
        const searchForm = document.querySelector('form[role="search"], .search-form');
        if (searchForm && !searchForm.getAttribute('role')) {
            searchForm.setAttribute('role', 'search');
            searchForm.setAttribute('aria-label', 'Search properties');
        }
    }
    
    setupFocusManagement() {
        // Focus management for modals and dynamic content
        this.setupModalFocus();
        this.setupDropdownFocus();
    }
    
    setupModalFocus() {
        // Trap focus in modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const modal = document.querySelector('.modal:not([style*="display: none"]), .cookie-modal.show');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }
    
    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
    
    setupDropdownFocus() {
        // Manage focus for dropdown menus
        const dropdowns = document.querySelectorAll('.theme-menu, .accessibility-menu');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateDropdown(e, dropdown);
                }
            });
        });
    }
    
    navigateDropdown(e, dropdown) {
        const items = dropdown.querySelectorAll('[role="menuitem"], button, a');
        const currentIndex = Array.from(items).indexOf(document.activeElement);
        let nextIndex;
        
        if (e.key === 'ArrowDown') {
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        }
        
        items[nextIndex].focus();
    }
    
    toggleToolbar() {
        const menu = document.getElementById('accessibility-menu');
        const isOpen = menu.classList.contains('show');
        
        if (isOpen) {
            menu.classList.remove('show');
            menu.setAttribute('aria-hidden', 'true');
        } else {
            menu.classList.add('show');
            menu.setAttribute('aria-hidden', 'false');
            menu.querySelector('button').focus();
        }
    }
    
    increaseFontSize() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const newSize = Math.min(currentSize * 1.1, 24); // Max 24px
        document.documentElement.style.fontSize = newSize + 'px';
        localStorage.setItem('domislink-font-size', newSize);
        this.announceToScreenReader('Font size increased');
    }
    
    decreaseFontSize() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const newSize = Math.max(currentSize * 0.9, 12); // Min 12px
        document.documentElement.style.fontSize = newSize + 'px';
        localStorage.setItem('domislink-font-size', newSize);
        this.announceToScreenReader('Font size decreased');
    }
    
    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('domislink-high-contrast', isHighContrast);
        this.announceToScreenReader(isHighContrast ? 'High contrast enabled' : 'High contrast disabled');
    }
    
    toggleScreenReader() {
        document.body.classList.toggle('screen-reader-mode');
        const isScreenReaderMode = document.body.classList.contains('screen-reader-mode');
        localStorage.setItem('domislink-screen-reader', isScreenReaderMode);
        this.announceToScreenReader(isScreenReaderMode ? 'Screen reader mode enabled' : 'Screen reader mode disabled');
    }
    
    toggleKeyboardNav() {
        document.body.classList.toggle('keyboard-navigation-always');
        const isAlwaysOn = document.body.classList.contains('keyboard-navigation-always');
        localStorage.setItem('domislink-keyboard-nav', isAlwaysOn);
        this.announceToScreenReader(isAlwaysOn ? 'Keyboard navigation highlights always on' : 'Keyboard navigation highlights on focus only');
    }
    
    setupColorContrastToggle() {
        // Load saved preferences
        const savedFontSize = localStorage.getItem('domislink-font-size');
        if (savedFontSize) {
            document.documentElement.style.fontSize = savedFontSize + 'px';
        }
        
        const highContrast = localStorage.getItem('domislink-high-contrast') === 'true';
        if (highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        const screenReaderMode = localStorage.getItem('domislink-screen-reader') === 'true';
        if (screenReaderMode) {
            document.body.classList.add('screen-reader-mode');
        }
        
        const keyboardNavAlways = localStorage.getItem('domislink-keyboard-nav') === 'true';
        if (keyboardNavAlways) {
            document.body.classList.add('keyboard-navigation-always');
        }
    }
    
    addScreenReaderSupport() {
        // Add screen reader announcements area
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
        
        // Add descriptions to images without alt text
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            img.setAttribute('alt', 'Image');
        });
        
        // Add descriptions to decorative images
        const decorativeImages = document.querySelectorAll('img[alt=""]');
        decorativeImages.forEach(img => {
            img.setAttribute('role', 'presentation');
        });
    }
    
    announceToScreenReader(message) {
        const announcer = document.getElementById('screen-reader-announcer');
        if (announcer) {
            announcer.textContent = message;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }
    
    closeAllModals() {
        // Close cookie modal
        const cookieModal = document.querySelector('.cookie-modal.show');
        if (cookieModal) {
            cookieModal.classList.remove('show');
        }
        
        // Close theme menu
        const themeMenu = document.querySelector('.theme-menu.show');
        if (themeMenu) {
            themeMenu.classList.remove('show');
        }
        
        // Close accessibility menu
        const accessibilityMenu = document.getElementById('accessibility-menu');
        if (accessibilityMenu && accessibilityMenu.classList.contains('show')) {
            accessibilityMenu.classList.remove('show');
        }
    }
    
    resetAccessibility() {
        // Reset all accessibility settings
        document.documentElement.style.fontSize = '';
        document.body.classList.remove('high-contrast', 'screen-reader-mode', 'keyboard-navigation-always');
        
        // Clear localStorage
        localStorage.removeItem('domislink-font-size');
        localStorage.removeItem('domislink-high-contrast');
        localStorage.removeItem('domislink-screen-reader');
        localStorage.removeItem('domislink-keyboard-nav');
        
        this.announceToScreenReader('All accessibility settings reset');
    }
    
    addAccessibilityStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Skip Links */
            .skip-links {
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 10001;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary, #3498db);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: 600;
                z-index: 10001;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 6px;
            }
            
            /* Accessibility Toolbar */
            .accessibility-toolbar {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                z-index: 9999;
                background: var(--surface, white);
                border: 1px solid var(--border, #dee2e6);
                border-right: none;
                border-radius: 8px 0 0 8px;
                box-shadow: -4px 0 12px var(--shadow, rgba(0,0,0,0.1));
            }
            
            .accessibility-toggle {
                background: var(--primary, #3498db);
                color: white;
                border: none;
                padding: 1rem 0.75rem;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
                border-radius: 8px 0 0 8px;
                transition: all 0.3s;
                writing-mode: vertical-rl;
                text-orientation: mixed;
            }
            
            .accessibility-toggle:hover,
            .accessibility-toggle:focus {
                background: var(--secondary, #27ae60);
                outline: 2px solid #EEFF00;
                outline-offset: 2px;
            }
            
            .accessibility-menu {
                position: absolute;
                right: 100%;
                top: 0;
                background: var(--surface, white);
                border: 1px solid var(--border, #dee2e6);
                border-radius: 8px 0 0 8px;
                box-shadow: -4px 0 12px var(--shadow, rgba(0,0,0,0.1));
                min-width: 200px;
                opacity: 0;
                visibility: hidden;
                transform: translateX(10px);
                transition: all 0.3s;
                display: flex;
                flex-direction: column;
            }
            
            .accessibility-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
            }
            
            .accessibility-menu button {
                background: none;
                border: none;
                padding: 1rem;
                text-align: left;
                cursor: pointer;
                color: var(--text, #333);
                border-bottom: 1px solid var(--border, #dee2e6);
                transition: all 0.3s;
                font-size: 0.9rem;
            }
            
            .accessibility-menu button:last-child {
                border-bottom: none;
            }
            
            .accessibility-menu button:hover,
            .accessibility-menu button:focus {
                background: var(--primary, #3498db);
                color: white;
                outline: none;
            }
            
            /* Screen Reader Only */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            /* Keyboard Navigation */
            .keyboard-navigation *:focus,
            .keyboard-navigation-always *:focus {
                outline: 3px solid #EEFF00 !important;
                outline-offset: 2px !important;
            }
            
            /* High Contrast Mode */
            .high-contrast {
                filter: contrast(150%) brightness(120%);
            }
            
            .high-contrast * {
                text-shadow: none !important;
                box-shadow: none !important;
            }
            
            .high-contrast a,
            .high-contrast button {
                text-decoration: underline !important;
            }
            
            /* Screen Reader Mode */
            .screen-reader-mode {
                font-family: Arial, sans-serif !important;
                line-height: 1.8 !important;
            }
            
            .screen-reader-mode * {
                animation: none !important;
                transition: none !important;
            }
            
            .screen-reader-mode img {
                max-width: 100px !important;
                height: auto !important;
            }
            
            /* Focus Indicators */
            button:focus,
            a:focus,
            input:focus,
            select:focus,
            textarea:focus,
            [tabindex]:focus {
                outline: 2px solid var(--primary, #3498db);
                outline-offset: 2px;
            }
            
            /* Improved Button Accessibility */
            button,
            [role="button"] {
                min-height: 44px;
                min-width: 44px;
                cursor: pointer;
            }
            
            button:disabled,
            [role="button"][aria-disabled="true"] {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            /* Form Accessibility */
            label {
                cursor: pointer;
            }
            
            input:required,
            select:required,
            textarea:required {
                border-left: 4px solid #e74c3c;
            }
            
            input:valid,
            select:valid,
            textarea:valid {
                border-left: 4px solid #27ae60;
            }
            
            /* Error States */
            .error,
            [aria-invalid="true"] {
                border-color: #e74c3c !important;
                background-color: rgba(231, 76, 60, 0.1) !important;
            }
            
            /* Success States */
            .success,
            [aria-invalid="false"] {
                border-color: #27ae60 !important;
                background-color: rgba(39, 174, 96, 0.1) !important;
            }
            
            /* Mobile Accessibility */
            @media (max-width: 768px) {
                .accessibility-toolbar {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    top: auto;
                    transform: none;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                }
                
                .accessibility-toggle {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    writing-mode: initial;
                    text-orientation: initial;
                    font-size: 0.8rem;
                }
                
                .accessibility-menu {
                    bottom: 70px;
                    right: 0;
                    top: auto;
                    border-radius: 8px;
                    transform: translateY(10px);
                }
                
                .accessibility-menu.show {
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize accessibility manager
let accessibilityManager;
document.addEventListener('DOMContentLoaded', function() {
    accessibilityManager = new AccessibilityManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
} else if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
}