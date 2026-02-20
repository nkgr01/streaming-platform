# 🎬 StreamingPlatform

Une plateforme de streaming moderne pour découvrir films et séries avec une interface époustouflante.

## ✨ Caractéristiques principales

- 🎥 **Découvrez des films et séries** à partir de l'API TMDB
- 🔍 **Recherche en temps réel** avec suggestions instantanées
- 🎭 **Pages détaillées** avec casting, bandes-annonces et synopsis
- 📱 **Design responsive** optimisé pour tous les appareils
- 🎨 **Interface moderne** avec Tailwind CSS et animations fluides
- ⚡ **Performance optimisée** avec Next.js 15 et Turbopack
- 🌙 **Mode sombre** par défaut
- 🔐 **API sécurisée** avec clés protégées côté serveur

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/streaming-platform.git
cd streaming-platform

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Ajouter votre clé TMDB dans .env.local
# Obtenir la clé: https://www.themoviedb.org/settings/api

# Lancer le serveur de développement
npm run dev
```

Accédez à [http://localhost:3000](http://localhost:3000)

## 🛠️ Stack technologique

- Next.js 15.3.3
- React 19.0.0
- Tailwind CSS 4.1.8
- TMDB API v3

## 📦 Commandes disponibles

```bash
npm run dev       # Développement
npm run build     # Build production
npm start         # Serveur production
npm run lint      # Vérifier le code
```

## 🌐 Déploiement sur Vercel

1. Pousser sur GitHub
2. Importer sur Vercel
3. Ajouter la variable d'environnement `TMDB_API_KEY`
4. Déployer

👉 [Guide complet de déploiement →](./DEPLOYMENT.md)

## 📄 Licence

MIT - Voir [LICENSE](./LICENSE) pour les détails
