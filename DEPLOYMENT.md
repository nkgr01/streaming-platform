# 📚 Guide de Déploiement - StreamingPlatform

## Table des matières
1. [Configuration locale](#configuration-locale)
2. [Déploiement sur GitHub](#déploiement-sur-github)
3. [Déploiement sur Vercel](#déploiement-sur-vercel)
4. [Avant de déployer](#avant-de-déployer)

---

## Configuration locale

### Étape 1: Cloner et configurer le projet

```bash
# Cloner le repository
git clone https://github.com/votre-username/streaming-platform.git
cd streaming-platform

# Installer les dépendances
npm install
```

### Étape 2: Configurer les variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local

# Éditer le fichier .env.local et ajouter votre clé TMDB
# TMDB_API_KEY=votre_clé_api_ici
```

### Étape 3: Obtenir une clé API TMDB

1. Accédez à [TMDB.org](https://www.themoviedb.org/settings/api)
2. Créez un compte (gratuit)
3. Demandez une clé API
4. Copiez votre clé et collez-la dans `.env.local`

### Étape 4: Lancer en développement

```bash
npm run dev
# L'application sera accessible sur http://localhost:3000
```

---

## Déploiement sur GitHub

### Étape 1: Initialiser un repository Git

```bash
# Si ce n'est pas déjà fait
git init
git add .
git commit -m "Initial commit: StreamingPlatform"
```

### Étape 2: Créer un repository sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur "New" pour créer un nouveau repository
3. Nommez-le `streaming-platform`
4. **Ne cochez PAS** "Initialize this repository with a README"
5. Cliquez sur "Create repository"

### Étape 3: Pousser votre code

```bash
# Ajouter le remote GitHub
git remote add origin https://github.com/votre-username/streaming-platform.git

# Renommer la branche pour matcher GitHub
git branch -M main

# Pousser le code
git push -u origin main
```

### Étape 4: Configurer .gitignore

Le `.gitignore` devrait déjà contenir :
```
node_modules/
.next/
.env.local
.env*.local
dist/
```

**Important:** Le fichier `.env.local` ne doit JAMAIS être commité (il contient votre clé API).

---

## Déploiement sur Vercel

### Étape 1: Connecter votre repository

1. Allez sur [Vercel.com](https://vercel.com)
2. Cliquez sur "Sign up" (si vous n'avez pas de compte)
3. Connectez-vous avec GitHub
4. Autorisez Vercel à accéder à votre GitHub

### Étape 2: Créer un nouveau projet

1. Cliquez sur "New Project"
2. Importez votre repository GitHub `streaming-platform`
3. Configurez les paramètres du projet

### Étape 3: Configurer les variables d'environnement

1. Dans les paramètres du projet Vercel, allez sur **Settings**
2. Cliquez sur **Environment Variables**
3. Ajoutez les variables :

```
TMDB_API_KEY = votre_clé_api_tmdb
NEXT_PUBLIC_SITE_URL = https://votre-domaine.vercel.app
```

### Étape 4: Déployer

1. Cliquez sur le bouton **Deploy**
2. Attendez que le déploiement se termine (2-3 minutes)
3. Votre application sera accessible à `https://votre-app.vercel.app`

### Étape 5: Domaine personnalisé (Optionnel)

1. Dans les paramètres Vercel, allez sur **Domains**
2. Ajoutez votre domaine personnel
3. Configurez les DNS records comme indiqué par Vercel

---

## Avant de déployer

### Checklist de sécurité

- ✅ Vérifier que `.env.local` est dans `.gitignore`
- ✅ Ne jamais commiter votre clé API
- ✅ Les variables sensibles sont définies dans Vercel
- ✅ Tester localement avant de pousser

### Checklist de performance

```bash
# Faire un build de production localement
npm run build

# Tester le build
npm start
```

### Commandes utiles

```bash
# Linter le code
npm run lint

# Build pour production
npm run build

# Démarrer le serveur de production
npm start

# Développement avec hot reload
npm run dev
```

---

## Troubleshooting

### Erreur: "TMDB_API_KEY is undefined"
- Vérifiez que `.env.local` existe localement
- Vérifiez que la variable est définie dans Vercel
- Redéployez après avoir ajouté la variable

### Erreur: "Port 3000 is already in use"
```bash
# Tuer le processus utilisant le port 3000
# Sur Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Build lent sur Vercel
- C'est normal, Vercel met en cache les builds
- Les déploiements suivants seront plus rapides

---

## Support et ressources

- 📖 [Documentation Next.js](https://nextjs.org/docs)
- 🎬 [API TMDB](https://www.themoviedb.org/settings/api)
- 🚀 [Documentation Vercel](https://vercel.com/docs)
- 💬 [GitHub Issues](https://github.com/votre-username/streaming-platform/issues)

---

**Bravo! Votre application StreamingPlatform est maintenant déployée! 🎉**
