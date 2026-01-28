// Theme Manager - Multi-theme support
class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Light',
                icon: '☀️',
                colors: {
                    background: '#f8f9fa',
                    surface: '#ffffff',
                    primary: '#3498db',
                    secondary: '#27ae60',
                    accent: '#e74c3c',
                    text: '#333333',
                    textSecondary: '#666666',
                    border: '#dee2e6',
                    shadow: 'rgba(0,0,0,0.1)',
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }
            },
            dark: {
                name: 'Dark',
                icon: '🌙',
                colors: {
                    background: '#0a0a0f',
                    surface: '#16161d',
                    primary: '#EEFF00',
                    secondary: '#4CAF50',
                    accent: '#FF6B6B',
                    text: '#ffffff',
                    textSecondary: '#cccccc',
                    border: '#333333',
                    shadow: 'rgba(238,255,0,0.2)',
                    gradient: 'linear-gradient(135deg, #16161d 0%, #0a0a0f 100%)'
                }
            },
            blue: {
                name: 'Ocean Blue',
                icon: '🌊',
                colors: {
                    background: '#f0f8ff',
                    surface: '#ffffff',
                    primary: '#1e3a8a',
                    secondary: '#0ea5e9',
                    accent: '#06b6d4',
                    text: '#1e293b',
                    textSecondary: '#64748b',
                    border: '#cbd5e1',
                    shadow: 'rgba(30,58,138,0.1)',
                    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
                }
            },
            green: {
                name: 'Nature Green',
                icon: '🌿',
                colors: {
                    background: '#f0fdf4',
                    surface: '#ffffff',
                    primary: '#166534',
                    secondary: '#16a34a',
                    accent: '#22c55e',
                    text: '#14532d',
                    textSecondary: '#4ade80',
                    border: '#bbf7d0',
                    shadow: 'rgba(22,101,52,0.1)',
                    gradient: 'linear-gradient(135deg, #166534 0%, #16a34a 100%)'
                }
            },
            purple: {
                name: 'Royal Purple',
                icon: '💜',
                colors: {
                    background: '#faf5ff',
                    surface: '#ffffff',
                    primary: '#7c3aed',
                    secondary: '#a855f7',
                    accent: '#c084fc',
                    text: '#581c87',
                    textSecondary: '#7c2d12',
                    border: '#e9d5ff',
                    shadow: 'rgba(124,58,237,0.1)',
                    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                }
            },
            sunset: {
                name: 'Sunset Orange',
                icon: '🌅',
                colors: {
                    background: '#fff7ed',
                    surface: '#ffffff',
                    primary: '#ea580c',
                    secondary: '#f97316',
                    accent: '#fb923c',
                    text: '#9a3412',
                    textSecondary: '#c2410c',
                    border: '#fed7aa',
                    shadow: 'rgba(234,88,12,0.1)',
                    gradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)'
                }
            }
        };
        
        this.currentTheme = this.getStoredTheme() || 'light';
        this.systemPreference = this.getSystemPreference();
        this.init();
    }
    
    init() {
        this.createThemeSelector();
        this.applyTheme(this.currentTheme);
        this.watchSystemPreference();
    }
    
    getStoredTheme() {
        return localStorage.getItem('domislink-theme');
    }
    
    getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    watchSystemPreference() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.systemPreference = e.matches ? 'dark' : 'light';
            if (this.currentTheme === 'system') {
                this.applyTheme('system');
            }
        });
    }
    
    createThemeSelector() {
        // Create theme selector if it doesn't exist
        if (document.getElementById('theme-selector')) return;
        
        const selector = document.createElement('div');
        selector.id = 'theme-selector';
        selector.className = 'theme-selector';
        
        const button = document.createElement('button');
        button.className = 'theme-toggle-btn';
        button.innerHTML = '🎨 Theme';
        button.onclick = () => this.toggleThemeMenu();
        
        const menu = document.createElement('div');
        menu.className = 'theme-menu';
        menu.id = 'theme-menu';
        
        // Add system option
        const systemOption = document.createElement('div');
        systemOption.className = 'theme-option';
        systemOption.innerHTML = `<span>💻</span> <span>System</span>`;
        systemOption.onclick = () => this.setTheme('system');
        menu.appendChild(systemOption);
        
        // Add theme options
        Object.keys(this.themes).forEach(themeKey => {
            const theme = this.themes[themeKey];
            const option = document.createElement('div');
            option.className = 'theme-option';
            option.innerHTML = `<span>${theme.icon}</span> <span>${theme.name}</span>`;
            option.onclick = () => this.setTheme(themeKey);
            menu.appendChild(option);
        });
        
        selector.appendChild(button);
        selector.appendChild(menu);
        
        // Add to header or create floating button
        const header = document.querySelector('.header .container') || document.querySelector('.top');
        if (header) {
            header.appendChild(selector);
        } else {
            selector.style.position = 'fixed';
            selector.style.top = '20px';
            selector.style.right = '20px';
            selector.style.zIndex = '1000';
            document.body.appendChild(selector);
        }
        
        this.addThemeSelectorStyles();
    }
    
    addThemeSelectorStyles() {
        if (document.getElementById('theme-selector-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'theme-selector-styles';
        styles.textContent = `
            .theme-selector {
                position: relative;
                display: inline-block;
            }
            
            .theme-toggle-btn {
                background: var(--surface, #ffffff);
                color: var(--text, #333333);
                border: 1px solid var(--border, #dee2e6);
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s;
                box-shadow: 0 2px 4px var(--shadow, rgba(0,0,0,0.1));
            }
            
            .theme-toggle-btn:hover {
                background: var(--primary, #3498db);
                color: white;
                transform: translateY(-1px);
            }
            
            .theme-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--surface, #ffffff);
                border: 1px solid var(--border, #dee2e6);
                border-radius: 8px;
                box-shadow: 0 4px 20px var(--shadow, rgba(0,0,0,0.1));
                min-width: 180px;
                z-index: 1001;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s;
                margin-top: 0.5rem;
            }
            
            .theme-menu.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .theme-option {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: all 0.3s;
                color: var(--text, #333333);
                border-bottom: 1px solid var(--border, #dee2e6);
            }
            
            .theme-option:last-child {
                border-bottom: none;
            }
            
            .theme-option:hover {
                background: var(--primary, #3498db);
                color: white;
            }
            
            .theme-option.active {
                background: var(--primary, #3498db);
                color: white;
                font-weight: 600;
            }
            
            .theme-option span:first-child {
                font-size: 1.2rem;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    toggleThemeMenu() {
        const menu = document.getElementById('theme-menu');
        menu.classList.toggle('show');
        
        // Close menu when clicking outside
        if (menu.classList.contains('show')) {
            setTimeout(() => {
                document.addEventListener('click', this.closeMenuOnOutsideClick.bind(this), { once: true });
            }, 100);
        }
    }
    
    closeMenuOnOutsideClick(event) {
        const selector = document.getElementById('theme-selector');
        if (!selector.contains(event.target)) {
            document.getElementById('theme-menu').classList.remove('show');
        }
    }
    
    setTheme(themeName) {
        this.currentTheme = themeName;
        localStorage.setItem('domislink-theme', themeName);
        this.applyTheme(themeName);
        document.getElementById('theme-menu').classList.remove('show');
        
        // Update active state
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        
        const activeOption = Array.from(document.querySelectorAll('.theme-option')).find(option => {
            const text = option.textContent.trim();
            return (themeName === 'system' && text === 'System') || 
                   (this.themes[themeName] && text === this.themes[themeName].name);
        });
        
        if (activeOption) {
            activeOption.classList.add('active');
        }
    }
    
    applyTheme(themeName) {
        let theme;
        
        if (themeName === 'system') {
            theme = this.themes[this.systemPreference];
        } else {
            theme = this.themes[themeName] || this.themes.light;
        }
        
        // Apply CSS custom properties
        const root = document.documentElement;
        Object.keys(theme.colors).forEach(key => {
            root.style.setProperty(`--${key}`, theme.colors[key]);
        });
        
        // Update body class for theme-specific styles
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName === 'system' ? this.systemPreference : themeName}`);
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: themeName, colors: theme.colors }
        }));
    }\n    \n    getCurrentTheme() {\n        return this.currentTheme;\n    }\n    \n    getThemeColors() {\n        const themeName = this.currentTheme === 'system' ? this.systemPreference : this.currentTheme;\n        return this.themes[themeName]?.colors || this.themes.light.colors;\n    }\n}\n\n// Auto-initialize theme manager\nlet themeManager;\ndocument.addEventListener('DOMContentLoaded', function() {\n    themeManager = new ThemeManager();\n});\n\n// Export for global use\nif (typeof window !== 'undefined') {\n    window.ThemeManager = ThemeManager;\n    window.getThemeManager = () => themeManager;\n}