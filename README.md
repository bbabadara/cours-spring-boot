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

- **SPA modulaire** : chaque fichier a une responsabilité unique, partagé via le namespace `window.SB`
- **Hash-based routing** : navigation sans rechargement (#/module/module-1, #/)
- **Composants réutilisables** : `ModuleCard` accepte n'importe quel tableau de modules
- **Données découplées** : le contenu (modules.js) est indépendant du rendu
- **Pas de dépendance** : vanilla JS + Tailwind CSS (CDN), zéro framework

### Flux de rendu

```
Chargement des scripts (ordre garanti)
  → utils/dom.js       → window.SB.DomUtils
  → data/modules.js    → window.SB.MODULES
  → router.js          → window.SB.Router
  → components/*.js    → window.SB.Navigation, .Hero, .ModuleCard, .ModuleDetail
  → app.js             → App() constructor
    → DOMContentLoaded
      → new App()
        → initRouter()        → enregistre les routes
        → initNavigation()    → construit la navbar
        → router.start()      → lit le hash (#/ ou #/module/:id)
          → renderHome()      → Hero + grille de modules
          → renderModule(id)  → Détail complet du module
          → renderNotFound()  → Page 404
```

## Utilisation

```bash
# 1. Lancer un serveur HTTP local
python -m http.server 3000

# OU avec VS Code
# Clic droit sur index.html → "Open with Live Server"

# 2. Ouvrir http://localhost:3000
```

## Compatibilité

Fonctionne sur tous les navigateurs modernes (Chrome, Firefox, Safari, Edge).
Aucun prérequis spécifique — les scripts sont chargés de manière standard.
