class App {
  constructor() {
    const SB = window.SB;
    this.hero = new SB.Hero();
    this.moduleCard = new SB.ModuleCard();
    this.moduleDetail = new SB.ModuleDetail();
    this.initRouter();
    this.initNavigation();
    this.router.start();
  }

  initRouter() {
    this.router = new window.SB.Router([], '#app');

    this.router.register({
      path: '/',
      handler: (outlet) => this.renderHome(outlet)
    });

    this.router.register({
      path: '/module/:id',
      handler: (outlet, params) => this.renderModule(outlet, params)
    });

    this.router.register({
      path: '/404',
      handler: (outlet) => this.renderNotFound(outlet)
    });
  }

  initNavigation() {
    this.nav = new window.SB.Navigation(this.router);
  }

  renderHome(outlet) {
    const SB = window.SB;
    SB.DomUtils.empty(outlet);

    const wrapper = document.createElement('div');
    this.hero.render(wrapper);

    const modulesSection = document.createElement('div');
    modulesSection.className = 'bg-gray-900 py-16';
    const title = document.createElement('div');
    title.className = 'text-center mb-8 px-4';
    title.innerHTML = `
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
        Les 6 modules de la formation
      </h2>
      <p class="text-gray-400 text-lg max-w-2xl mx-auto">
        Chaque module est conçu pour un niveau architecte avec du contenu technique approfondi
      </p>
    `;
    modulesSection.appendChild(title);
    this.moduleCard.renderGrid(modulesSection, SB.MODULES);
    wrapper.appendChild(modulesSection);

    const footer = document.createElement('footer');
    footer.className = 'bg-gray-950 border-t border-white/10 py-8';
    footer.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-gray-500 text-sm">
          Spring Boot Academy — Formation intensive pour Architectes Logiciel & DevOps
        </p>
      </div>
    `;
    wrapper.appendChild(footer);

    outlet.appendChild(wrapper);
  }

  renderModule(outlet, params) {
    const SB = window.SB;
    const module = SB.MODULES.find(m => m.id === params.id);
    if (!module) {
      this.router.navigate('/404');
      return;
    }
    SB.DomUtils.empty(outlet);
    const wrapper = document.createElement('div');
    this.moduleDetail.render(wrapper, module);

    const nav = document.createElement('nav');
    nav.className = 'bg-gray-950 border-t border-white/10 py-8 px-4';
    nav.innerHTML = `
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-gray-500 text-sm">
          Spring Boot Academy — Module ${module.number} : ${module.title}
        </p>
      </div>
    `;
    wrapper.appendChild(nav);

    outlet.appendChild(wrapper);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderNotFound(outlet) {
    window.SB.DomUtils.empty(outlet);
    outlet.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div class="text-center px-4">
          <div class="text-8xl mb-6">🔍</div>
          <h1 class="text-4xl font-bold text-white mb-4">Module non trouvé</h1>
          <p class="text-gray-400 text-lg mb-8">Le module que vous recherchez n'existe pas.</p>
          <a href="#/" class="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour à l'accueil
          </a>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('[Spring Boot Academy] Initialisation...');
  try {
    new App();
    console.log('[Spring Boot Academy] ✓ Application démarrée');
  } catch (e) {
    console.error('[Spring Boot Academy] ✗ Erreur:', e);
    document.getElementById('app').innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#111827;color:#ef4444;font-family:sans-serif;text-align:center;padding:2rem">
        <div>
          <h1 style="font-size:1.5rem;margin-bottom:1rem;color:#fff">Erreur de chargement</h1>
          <p>${e.message}</p>
          <p style="margin-top:1rem;font-size:0.875rem;color:#9ca3af">Ouvrez la console (F12) pour plus de détails.</p>
        </div>
      </div>`;
  }
});
