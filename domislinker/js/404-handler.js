// 404 Error Page Handler
function handle404() {
    const currentPath = window.location.pathname;
    const validPaths = [
        '/',
        '/index.html',
        '/community.html', 
        '/post-ad.html',
        '/agent.html',
        '/dashboard.html',
        '/ai-promo-engine.html'
    ];
    
    // Check if current path is valid
    if (!validPaths.includes(currentPath) && currentPath !== '/404.html') {
        // Redirect to 404 page or show 404 content
        show404Page();
    }
}

function show404Page() {
    document.body.innerHTML = `
        <div class="error-page">
            <div class="error-container">
                <div class="error-code">404</div>
                <h1>Page Not Found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                
                <div class="error-actions">
                    <a href="/" class="btn btn-primary">Go Home</a>
                    <a href="/community.html" class="btn">Browse Communities</a>
                    <button onclick="goBack()" class="btn btn-secondary">Go Back</button>
                </div>
                
                <div class="suggested-links">
                    <h3>Try these instead:</h3>
                    <ul>
                        <li><a href="/">🏠 Home</a></li>
                        <li><a href="/community.html">🌍 Communities</a></li>
                        <li><a href="/post-ad.html">📝 Post Property</a></li>
                        <li><a href="/agent.html">👤 Become Agent</a></li>
                        <li><a href="/ai-promo-engine.html">🤖 AI Promo Engine</a></li>
                    </ul>
                </div>
            </div>
        </div>
        
        <style>
            .error-page {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--background, #f8f9fa);
                color: var(--text, #333);
                font-family: 'Inter', sans-serif;
                padding: 2rem;
            }
            
            .error-container {
                text-align: center;
                max-width: 500px;
            }
            
            .error-code {
                font-size: 8rem;
                font-weight: bold;
                color: var(--primary, #3498db);
                line-height: 1;
                margin-bottom: 1rem;
            }
            
            .error-container h1 {
                font-size: 2rem;
                margin-bottom: 1rem;
                color: var(--text, #333);
            }
            
            .error-container p {
                font-size: 1.1rem;
                color: var(--textSecondary, #666);
                margin-bottom: 2rem;
            }
            
            .error-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 3rem;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 500;
                border: none;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .btn-primary {
                background: var(--primary, #3498db);
                color: white;
            }
            
            .btn-secondary {
                background: var(--textSecondary, #666);
                color: white;
            }
            
            .btn:not(.btn-primary):not(.btn-secondary) {
                background: var(--surface, white);
                color: var(--text, #333);
                border: 1px solid var(--border, #dee2e6);
            }
            
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px var(--shadow, rgba(0,0,0,0.1));
            }
            
            .suggested-links {
                text-align: left;
                background: var(--surface, white);
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 20px var(--shadow, rgba(0,0,0,0.1));
            }
            
            .suggested-links h3 {
                margin-bottom: 1rem;
                color: var(--text, #333);
            }
            
            .suggested-links ul {
                list-style: none;
                padding: 0;
            }
            
            .suggested-links li {
                margin-bottom: 0.5rem;
            }
            
            .suggested-links a {
                color: var(--primary, #3498db);
                text-decoration: none;
                font-weight: 500;
            }
            
            .suggested-links a:hover {
                text-decoration: underline;
            }
            
            @media (max-width: 768px) {
                .error-code {
                    font-size: 6rem;
                }
                
                .error-actions {
                    flex-direction: column;
                    align-items: center;
                }
                
                .btn {
                    width: 200px;
                }
            }
        </style>
    `;
    
    // Log 404 error
    if (window.errorTracker) {
        window.errorTracker.reportError('404 Page Not Found', {
            requestedPath: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        });
    }
}

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

// Check for 404 on page load
document.addEventListener('DOMContentLoaded', handle404);