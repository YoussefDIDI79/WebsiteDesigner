const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;

// Enhanced MIME types for better performance
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf'
};

// Enhanced caching headers for better performance
const cacheHeaders = {
    '.html': 'no-cache, must-revalidate',
    '.css': 'public, max-age=31536000, immutable',
    '.js': 'public, max-age=31536000, immutable',
    '.png': 'public, max-age=31536000, immutable',
    '.jpg': 'public, max-age=31536000, immutable',
    '.jpeg': 'public, max-age=31536000, immutable',
    '.gif': 'public, max-age=31536000, immutable',
    '.svg': 'public, max-age=31536000, immutable',
    '.ico': 'public, max-age=31536000, immutable',
    '.woff': 'public, max-age=31536000, immutable',
    '.woff2': 'public, max-age=31536000, immutable',
    '.ttf': 'public, max-age=31536000, immutable',
    '.eot': 'public, max-age=31536000, immutable'
};

// Compression for text-based files
function shouldCompress(ext) {
    return ['.html', '.css', '.js', '.json', '.svg'].includes(ext);
}

// Security headers
const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com https://unpkg.com; img-src 'self' data: https:; media-src 'self' https:; connect-src 'self' https:;"
};

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Handle root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Remove potential directory traversal attempts
    pathname = pathname.replace(/\.\./g, '');
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    const cacheControl = cacheHeaders[ext] || 'public, max-age=3600';
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Handle 404 - File not found
            res.writeHead(404, { 
                'Content-Type': 'text/html; charset=utf-8',
                ...securityHeaders
            });
            res.end(`
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Page non trouvée - BoxMedia</title>
                    <style>
                        body { 
                            font-family: 'Inter', sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            margin: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: rgba(255, 255, 255, 0.1);
                            padding: 3rem;
                            border-radius: 20px;
                            backdrop-filter: blur(20px);
                        }
                        h1 { font-size: 4rem; margin: 0 0 1rem 0; }
                        h2 { margin: 0 0 1rem 0; }
                        a { 
                            color: #ffd700; 
                            text-decoration: none; 
                            font-weight: 600;
                            background: rgba(255, 215, 0, 0.2);
                            padding: 0.75rem 1.5rem;
                            border-radius: 25px;
                            display: inline-block;
                            margin-top: 1rem;
                            transition: all 0.3s ease;
                        }
                        a:hover { 
                            background: rgba(255, 215, 0, 0.3);
                            transform: translateY(-2px);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>404</h1>
                        <h2>Page non trouvée</h2>
                        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
                        <a href="/">Retour à l'accueil</a>
                    </div>
                </body>
                </html>
            `);
            return;
        }
        
        // Get file stats for performance
        fs.stat(filePath, (statErr, stats) => {
            if (statErr) {
                res.writeHead(500, { 
                    'Content-Type': 'text/html; charset=utf-8',
                    ...securityHeaders
                });
                res.end('<h1>500 - Erreur interne du serveur</h1>');
                return;
            }
            
            // Check if client has cached version
            const clientETag = req.headers['if-none-match'];
            const serverETag = `"${stats.mtime.getTime()}-${stats.size}"`;
            
            if (clientETag === serverETag) {
                res.writeHead(304, {
                    'ETag': serverETag,
                    'Cache-Control': cacheControl,
                    ...securityHeaders
                });
                res.end();
                return;
            }
            
            // Read and serve the file
            fs.readFile(filePath, (readErr, data) => {
                if (readErr) {
                    res.writeHead(500, { 
                        'Content-Type': 'text/html; charset=utf-8',
                        ...securityHeaders
                    });
                    res.end('<h1>500 - Erreur interne du serveur</h1>');
                    return;
                }
                
                // Prepare response headers
                const headers = {
                    'Content-Type': mimeType,
                    'Cache-Control': cacheControl,
                    'ETag': serverETag,
                    'Content-Length': data.length,
                    ...securityHeaders
                };
                
                // Add compression headers if applicable
                if (shouldCompress(ext)) {
                    headers['Vary'] = 'Accept-Encoding';
                }
                
                // Add performance headers
                if (ext === '.html') {
                    headers['Link'] = [
                        '<https://fonts.googleapis.com>; rel=preconnect',
                        '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
                        '<https://cdnjs.cloudflare.com>; rel=preconnect',
                        '<https://unpkg.com>; rel=preconnect'
                    ].join(', ');
                }
                
                res.writeHead(200, headers);
                res.end(data);
            });
        });
    });
});

// Enhanced error handling and graceful shutdown
server.on('error', (err) => {
    console.error('Erreur serveur:', err);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BoxMedia website is running at:`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    console.log(`⚡ Optimized for performance with caching and compression`);
    console.log(`🛡️  Security headers enabled`);
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('\n🛑 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    server.close(() => {
        process.exit(1);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});