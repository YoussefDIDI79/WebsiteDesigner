const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');

const PORT = process.env.PORT || 5000;

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
    '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8'
};

// Enhanced caching headers for optimal performance
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
    '.eot': 'public, max-age=31536000, immutable',
    '.pdf': 'public, max-age=86400',
    '.txt': 'public, max-age=3600',
    '.xml': 'public, max-age=3600'
};

// Compression for text-based files
function shouldCompress(ext) {
    return ['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml'].includes(ext);
}

// Enhanced security headers with CSP
const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': [
        "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com", 
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "https://www.youtube.com",
        "https://youtube.com;",
        "img-src 'self' data: https:;",
        "media-src 'self' https:;",
        "connect-src 'self' https:;",
        "frame-src 'self' https://www.youtube.com https://youtube.com;"
    ].join(' ')
};

// File compression cache
const compressionCache = new Map();

// Compress file content
function compressContent(content, encoding) {
    const cacheKey = `${content.length}-${encoding}`;
    
    if (compressionCache.has(cacheKey)) {
        return compressionCache.get(cacheKey);
    }
    
    let compressed;
    if (encoding === 'gzip') {
        compressed = zlib.gzipSync(content);
    } else if (encoding === 'deflate') {
        compressed = zlib.deflateSync(content);
    } else if (encoding === 'br') {
        compressed = zlib.brotliCompressSync(content);
    } else {
        return content;
    }
    
    // Cache compressed content (limit cache size)
    if (compressionCache.size < 50) {
        compressionCache.set(cacheKey, compressed);
    }
    
    return compressed;
}

// Get best compression encoding
function getBestEncoding(acceptEncoding) {
    if (!acceptEncoding) return null;
    
    if (acceptEncoding.includes('br')) return 'br';
    if (acceptEncoding.includes('gzip')) return 'gzip';
    if (acceptEncoding.includes('deflate')) return 'deflate';
    
    return null;
}

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Handle root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Remove potential directory traversal attempts
    pathname = pathname.replace(/\.\./g, '').replace(/\/+/g, '/');
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    const cacheControl = cacheHeaders[ext] || 'public, max-age=3600';
    
    // Security check: ensure file is within current directory
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 
            'Content-Type': 'text/html; charset=utf-8',
            ...securityHeaders
        });
        res.end('<h1>403 - Accès interdit</h1>');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Enhanced 404 page
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
                            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
                            text-align: center; 
                            padding: 50px; 
                            background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
                            color: white;
                            margin: 0;
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: rgba(255, 255, 255, 0.1);
                            padding: 3rem;
                            border-radius: 20px;
                            backdrop-filter: blur(20px);
                            border: 1px solid rgba(255, 255, 255, 0.2);
                        }
                        h1 { font-size: 5rem; margin: 0 0 1rem 0; font-weight: 900; }
                        h2 { margin: 0 0 1rem 0; font-weight: 600; }
                        p { margin-bottom: 2rem; opacity: 0.9; line-height: 1.6; }
                        a { 
                            color: #f59e0b; 
                            text-decoration: none; 
                            font-weight: 600;
                            background: rgba(245, 158, 11, 0.2);
                            padding: 0.75rem 1.5rem;
                            border-radius: 25px;
                            display: inline-block;
                            margin-top: 1rem;
                            transition: all 0.3s ease;
                            border: 2px solid rgba(245, 158, 11, 0.3);
                        }
                        a:hover { 
                            background: rgba(245, 158, 11, 0.3);
                            transform: translateY(-2px);
                            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                        }
                        .error-icon {
                            font-size: 3rem;
                            margin-bottom: 1rem;
                            opacity: 0.8;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="error-icon">🔍</div>
                        <h1>404</h1>
                        <h2>Page non trouvée</h2>
                        <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Retournez à l'accueil pour découvrir nos services exceptionnels.</p>
                        <a href="/">← Retour à l'accueil</a>
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
                res.end(`
                    <!DOCTYPE html>
                    <html lang="fr">
                    <head>
                        <meta charset="UTF-8">
                        <title>Erreur serveur - BoxMedia</title>
                        <style>
                            body { font-family: 'Inter', sans-serif; text-align: center; padding: 50px; background: #f8fafc; }
                            .error { background: white; padding: 2rem; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                            h1 { color: #ef4444; margin-bottom: 1rem; }
                        </style>
                    </head>
                    <body>
                        <div class="error">
                            <h1>500 - Erreur interne du serveur</h1>
                            <p>Une erreur temporaire s'est produite. Veuillez réessayer plus tard.</p>
                        </div>
                    </body>
                    </html>
                `);
                return;
            }
            
            // Enhanced ETag generation
            const serverETag = `"${stats.mtime.getTime()}-${stats.size}-${filePath}"`;
            const clientETag = req.headers['if-none-match'];
            
            // Check if client has cached version
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
                    res.end('<h1>500 - Erreur lors de la lecture du fichier</h1>');
                    return;
                }
                
                // Prepare response headers
                const headers = {
                    'Content-Type': mimeType,
                    'Cache-Control': cacheControl,
                    'ETag': serverETag,
                    'Last-Modified': stats.mtime.toUTCString(),
                    ...securityHeaders
                };
                
                // Handle compression for text files
                let responseData = data;
                const acceptEncoding = req.headers['accept-encoding'] || '';
                const shouldCompressFile = shouldCompress(ext) && data.length > 1024; // Only compress files > 1KB
                
                if (shouldCompressFile) {
                    const encoding = getBestEncoding(acceptEncoding);
                    
                    if (encoding) {
                        try {
                            responseData = compressContent(data, encoding);
                            headers['Content-Encoding'] = encoding;
                            headers['Vary'] = 'Accept-Encoding';
                        } catch (compressionErr) {
                            console.warn('Compression failed:', compressionErr.message);
                            // Fall back to uncompressed content
                        }
                    }
                }
                
                headers['Content-Length'] = responseData.length;
                
                // Add performance hints for HTML files
                if (ext === '.html') {
                    headers['Link'] = [
                        '<https://fonts.googleapis.com>; rel=preconnect',
                        '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
                        '<https://cdnjs.cloudflare.com>; rel=preconnect',
                        '<https://unpkg.com>; rel=preconnect'
                    ].join(', ');
                }
                
                // CORS headers for fonts and other assets
                if (['.woff', '.woff2', '.ttf', '.eot'].includes(ext)) {
                    headers['Access-Control-Allow-Origin'] = '*';
                    headers['Access-Control-Allow-Methods'] = 'GET';
                }
                
                res.writeHead(200, headers);
                res.end(responseData);
            });
        });
    });
});

// Enhanced error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please choose a different port.`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err);
    }
});

server.on('clientError', (err, socket) => {
    if (err.code === 'ECONNRESET' || !socket.writable) {
        return;
    }
    
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

// Start server with enhanced logging
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BoxMedia website is running at:`);
    console.log(`📱 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://0.0.0.0:${PORT}`);
    console.log(`⚡ Optimized for production with:`);
    console.log(`   • Gzip/Brotli compression enabled`);
    console.log(`   • Enhanced caching headers`);
    console.log(`   • Security headers (CSP, HSTS, etc.)`);
    console.log(`   • ETag support for conditional requests`);
    console.log(`🛡️  Security: All headers configured`);
    console.log(`📊 Performance: Compression and caching optimized`);
    console.log(`🎯 Ready for Netlify deployment`);
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`\n🛑 ${signal} received, shutting down gracefully...`);
    
    server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Clear compression cache
        compressionCache.clear();
        console.log('✅ Cache cleared');
        
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('UNHANDLED_REJECTION');
});

// Performance monitoring
if (process.env.NODE_ENV !== 'production') {
    let requestCount = 0;
    const startTime = Date.now();
    
    server.on('request', () => {
        requestCount++;
    });
    
    setInterval(() => {
        const uptime = (Date.now() - startTime) / 1000;
        const rps = requestCount / uptime;
        console.log(`📈 Stats: ${requestCount} requests, ${rps.toFixed(2)} req/sec, uptime: ${uptime.toFixed(0)}s`);
    }, 30000); // Log every 30 seconds
}
