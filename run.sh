#!/bin/bash

echo "🚀 Démarrage du site BoxMedia optimisé..."
echo "📍 Version française avec performances améliorées"
echo "⚡ Serveur Node.js avec cache et sécurité renforcés"
echo "🎨 Contraste amélioré pour une meilleure lisibilité"
echo "🌐 Prêt pour le déploiement Netlify"
echo ""

# Vérifier si Node.js est disponible
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js détecté - démarrage du serveur optimisé"
    echo "🔧 Fonctionnalités activées:"
    echo "   • Compression Gzip/Brotli"
    echo "   • Headers de sécurité"
    echo "   • Cache intelligent"
    echo "   • Contraste WCAG AA"
    echo ""
    node server.js
else
    echo "❌ Node.js non trouvé"
    echo "🔄 Basculement vers un serveur HTTP basique..."
    
    # Essayer Python 3 d'abord, puis Python 2
    if command -v python3 >/dev/null 2>&1; then
        echo "✅ Python 3 détecté - démarrage du serveur basique"
        echo "📂 Serveur de fichiers statiques sur le port 8000"
        echo "🌐 Accès: http://localhost:8000"
        echo ""
        python3 -m http.server 8000
    elif command -v python >/dev/null 2>&1; then
        echo "✅ Python 2 détecté - démarrage du serveur basique"
        echo "📂 Serveur de fichiers statiques sur le port 8000"
        echo "🌐 Accès: http://localhost:8000"
        echo ""
        python -m SimpleHTTPServer 8000
    else
        echo "❌ Aucun serveur approprié trouvé"
        echo "📦 Veuillez installer Node.js ou Python pour exécuter le serveur"
        echo ""
        echo "💡 Solutions:"
        echo "   • Installer Node.js: https://nodejs.org/"
        echo "   • Ou utiliser Python 3"
        echo "   • Ou déployer directement sur Netlify"
        exit 1
    fi
fi
