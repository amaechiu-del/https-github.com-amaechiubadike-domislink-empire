# Image Optimization Configuration
class ImageOptimizer {
    constructor() {
        this.supportedFormats = ['webp', 'avif', 'jpeg', 'png'];
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupResponsiveImages();
    }
    
    setupLazyLoading() {
        // Use Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            });
            
            // Observe all images with data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        
        if (src) {
            img.src = this.getOptimizedImageUrl(src);
        }
        if (srcset) {
            img.srcset = srcset;
        }
        
        img.classList.remove('lazy');
        img.classList.add('loaded');
    }
    
    getOptimizedImageUrl(originalUrl) {
        // Use Cloudflare Image Resizing
        const baseUrl = 'https://domislinker.com/cdn-cgi/image/';
        const params = new URLSearchParams({
            format: 'auto',
            quality: '85',
            width: '800'
        });
        
        return `${baseUrl}${params.toString()}/${originalUrl}`;
    }
    
    optimizeExistingImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (img.src && !img.src.includes('cdn-cgi/image')) {
                const optimizedSrc = this.getOptimizedImageUrl(img.src);
                img.src = optimizedSrc;
            }
            
            // Add loading attribute
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add alt text if missing
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', 'Image');
            }
        });
    }
    
    setupResponsiveImages() {
        // Add responsive image support
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('sizes')) {
                img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
            }
        });
    }
    
    // Helper function to create optimized image element
    createOptimizedImage(src, alt, className = '') {
        const img = document.createElement('img');
        img.setAttribute('data-src', src);
        img.setAttribute('alt', alt);
        img.setAttribute('loading', 'lazy');
        img.className = `lazy ${className}`;
        
        // Add placeholder
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+';
        
        return img;
    }
}

// Initialize image optimizer
document.addEventListener('DOMContentLoaded', () => {
    new ImageOptimizer();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
} else if (typeof window !== 'undefined') {
    window.ImageOptimizer = ImageOptimizer;
}