# Spring Boot Academy — Formation Architectes & DevOps

Application SPA présentant un programme de formation intensif Spring Boot pour Ingénieurs Architectes Logiciel et DevOps.

## Résumé du cours

6 modules couvrant l'intégralité du cycle de vie d'une application Spring Boot cloud-native :

| Module | Sujet |
|--------|-------|
| **Module 1** — Sous le capot | IoC, auto-configuration, propriétés, profiles |
| **Module 2** — Architectures modernes | Hexagonale, REST/gRPC/Event-Driven, JPA/R2DBC |
| **Module 3** — Microservices Spring Cloud | Discovery, Gateway, Config Server, Resilience4j |
| **Module 4** — Sécurité Zero Trust | Spring Security, OAuth2/OIDC, JWT |
| **Module 5** — Observabilité | Actuator, Prometheus/Grafana, Tracing, Logs JSON |
| **Module 6** — CI/CD & Déploiement | Buildpacks, K8s, GraalVM Native |

## Architecture du code

```
index.html               ← Point d'entrée SPA
css/style.css             ← Styles customs (scrollbar, grille, sélection)
js/
├── app.js                ← Entry point, orchestre routeur + vues
├── router.js             ← Routeur SPA hash-based (#/module/:id)
├── data/modules.js       ← Données des 6 modules (export ES module)
├── utils/dom.js          ← Helpers DOM
└── components/
    ├── navigation.js     ← Navbar responsive
    ├── hero.js           ← Page d'accueil
    ├── moduleCard.js     ← Carte de module réutilisable
    └── moduleDetail.js   ← Vue détail d'un module
```

### Principes d'architecture

- **SPA modulaire** : chaque fichier a une responsabilité unique, imports/exports ES6 natifs
- **Hash-based routing** : navigation sans rechargement (#/module/module-1, #/)
- **Composants réutilisables** : `ModuleCard` accepte n'importe quel tableau de modules
- **Données découplées** : le contenu (modules.js) est indépendant du rendu
- **Pas de framework JS** : vanilla JS + Tailwind CSS (CDN), zéro dépendance

### Flux de rendu

```
DOMContentLoaded
  → App() constructor
    → initRouter()           → enregistre les routes (/, /module/:id, /404)
    → initNavigation()       → construit la navbar dans <nav>
    → router.start()         → lit le hash et déclenche le handler
      → renderHome()         → Hero + grille de modules
      → renderModule(id)     → Détail complet d'un module
      → renderNotFound()     → Page 404
```

## Utilisation

```bash
# 1. Lancer un serveur HTTP local
python -m http.server 3000

# OU avec VS Code
# Clic droit sur index.html → "Open with Live Server"

# 2. Ouvrir http://localhost:3000
```

## Prérequis navigateur

Nécessite un navigateur supportant les ES modules (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+).
