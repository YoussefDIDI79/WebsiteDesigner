#!/bin/bash

echo "🚀 Starting BoxMedia French Portfolio Website..."
echo "⚡ Optimized version with enhanced accessibility and performance"
echo "🎨 Fixed contrast issues for better readability"
echo "🌐 Ready for Netlify deployment"
echo ""

# Check if Node.js is available
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js detected - starting optimized server"
    node server.js
else
    echo "❌ Node.js not found"
    echo "🔄 Falling back to basic HTTP server..."
    
    # Try Python 3 first, then Python 2
    if command -v python3 >/dev/null 2>&1; then
        echo "✅ Python 3 detected - starting basic server"
        python3 -m http.server 8000
    elif command -v python >/dev/null 2>&1; then
        echo "✅ Python 2 detected - starting basic server"
        python -m SimpleHTTPServer 8000
    else
        echo "❌ No suitable server found"
        echo "Please install Node.js or Python to run the server"
        exit 1
    fi
fi
