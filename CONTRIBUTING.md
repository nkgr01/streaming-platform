# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à CinéNow ! Ce guide vous permettra de contribuer efficacement.

## 📋 Code de Conduite

Ce projet respecte le [Covenant Code of Conduct](https://www.contributor-covenant.org/). 
Tous les contributeurs sont tenus de suivre ce code de conduite.

## ⚡ Étapes pour contribuer

### 1. Fork et Cloner

```bash
# Forker sur GitHub (bouton "Fork" en haut à droite)

# Cloner votre fork
git clone https://github.com/nkgr01/streaming-platform.git
cd streaming-platform

# Ajouter le upstream
git remote add upstream https://github.com/nkgr01/streaming-platform.git
```

### 2. Créer une branche

```bash
# Synchroniser avec main
git fetch upstream
git checkout main
git merge upstream/main

# Créer votre branche
git checkout -b feature/votre-feature-name
```

### 3. Faire les changements

- Respectez le style de code existant
- Écrivez du code lisible et commenté
- Testez vos changements localement

### 4. Committer vos changements

```bash
# Ajouter les fichiers
git add .

# Committer avec un message descriptif
git commit -m "feat: Description claire de votre changement"

# Utiliser ces préfixes:
# feat: nouvelle fonctionnalité
# fix: correction de bug
# docs: documentation
# style: formatage du code
# refactor: restructuration du code
# test: ajout de tests
# chore: tâches de maintenance
```

### 5. Pousser et créer une Pull Request

```bash
# Mettre à jour depuis upstream
git fetch upstream
git rebase upstream/main

# Pousser votre branche
git push origin feature/votre-feature-name
```

Allez sur GitHub et cliquez sur "Create Pull Request".

## 📝 Description de la Pull Request

Incluez :
- **Quoi:** Description claire du changement
- **Pourquoi:** Raison de ce changement
- **Comment:** Explication technique si nécessaire
- **Tests:** Comment avez-vous testé ?

Template :
```markdown
## Description
Brève description de ce qui a été changé.

## Type de changement
- [ ] Correction de bug
- [ ] Nouvelle fonctionnalité
- [ ] Changement non-breaking
- [ ] Changement breaking (corrige un problème existant)

## Tests
- [ ] Test effectué localement
- [ ] Aucun nouveau avertissement
- [ ] Les tests existants passent

## Screenshots (si applicable)
Ajouter des screenshots pour les changements UI

## Checklist
- [ ] Mon code suit les conventions du projet
- [ ] J'ai mis à jour la documentation si nécessaire
- [ ] Pas de changements non testé
```

## 🔍 Critères de révision

Avant de soumettre votre PR, vérifiez :

- ✅ **Code quality:** Le code est lisible et bien structuré
- ✅ **Tests:** Vos changements sont testés
- ✅ **Performance:** Pas de dégradation de performance
- ✅ **Sécurité:** Pas d'introduction de vulnérabilités
- ✅ **Documentation:** La documentation est à jour
- ✅ **Git history:** Les commits sont clairs et descriptifs

## 🚀 Types de contributions acceptées

### 🐛 Signaler un bug

```markdown
## Description
Décrire le bug clairement.

## Étapes pour reproduire
1. Allez à '...'
2. Cliquez sur '...'
3. Voir l'erreur

## Comportement attendu
Ce qui devrait se passer.

## Comportement actuel
Ce qui se passe réellement.

## Environment
- Navigateur: [e.g. Chrome 90.0]
- OS: [e.g. Windows 10]
- Version Node: [e.g. 16.0]
```

### ✨ Proposer une fonctionnalité

```markdown
## Problème
Décrivez le problème ou cas d'usage.

## Solution proposée
Comment résoudre ce problème.

## Alternatives considérées
D'autres solutions possibles.

## Contexte additionnel
Toute autre information utile.
```

## 🎨 Règles de style

### JavaScript/React

```javascript
// ❌ Mauvais
const fetchData=()=>{const data=await fetch(...); return data;}

// ✅ Bon
const fetchData = async () => {
  const data = await fetch('/api/data');
  return data;
};

// Utiliser des noms de variables explicites
const userMovieList = []; // ✅ Bon
const ml = []; // ❌ Mauvais
```

### Composants React

```javascript
// ✅ Bon: Arrow function avec export default
export default function MovieCard({ movie }) {
  return (
    <div>
      <h2>{movie.title}</h2>
    </div>
  );
}

// Ajouter des props valables
MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.required,
    title: PropTypes.string.required,
  }).required,
};
```

### CSS/Tailwind

```jsx
// ✅ Bon: Classes bien organisées
<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  
// ❌ Mauvais: Classes désorganisées  
<div className="shadow-lg rounded-lg transition-shadow hover:shadow-md p-4 bg-white">
```

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Git Workflow](https://git-scm.com/book/en/v2)

## ❓ Questions ?

- Créez un une Discussion
- Ouvrez une GitHub Issue
- Contactez l'équipe via email

---

**Merci pour votre contribution! 🎉**
