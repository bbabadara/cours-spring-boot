import DomUtils from '../utils/dom.js';

class Hero {
  render(container) {
    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
            <div class="text-center">
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8">
                <span class="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Formation intensive pour Architectes & DevOps
              </div>

              <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Spring Boot
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500"> sous toutes</span>
                ses coutures
              </h1>

              <p class="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                Un programme intensif conçu pour les Ingénieurs Architectes Logiciel et DevOps.
                Maîtrisez la mécanique interne du framework, son intégration cloud-native,
                et les patterns de résilience pour les systèmes critiques.
              </p>

              <div class="flex flex-wrap justify-center gap-4 mb-16">
                <a href="#/module/module-1" class="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg shadow-green-500/25">
                  Commencer la formation →
                </a>
                <a href="#/module/module-5" class="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transform hover:scale-105 transition-all duration-200 border border-white/10">
                  Voir le module Observabilité
                </a>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                ${[
                  { icon: '🔧', label: 'Module 1', desc: 'Sous le capot', color: 'from-blue-600 to-cyan-500' },
                  { icon: '🏗️', label: 'Module 2', desc: 'Architectures', color: 'from-emerald-600 to-teal-500' },
                  { icon: '☁️', label: 'Module 3', desc: 'Microservices', color: 'from-purple-600 to-violet-500' },
                  { icon: '🛡️', label: 'Module 4', desc: 'Sécurité', color: 'from-red-600 to-rose-500' },
                  { icon: '📊', label: 'Module 5', desc: 'Observabilité', color: 'from-amber-600 to-orange-500' },
                  { icon: '🚀', label: 'Module 6', desc: 'Déploiement', color: 'from-sky-600 to-indigo-500' }
                ].map(m => `
                  <a href="#/module/${m.label.toLowerCase().replace('module ', 'module-')}" 
                     class="group bg-white/5 backdrop-blur-sm rounded-xl p-4 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/20">
                    <div class="text-3xl mb-2">${m.icon}</div>
                    <div class="text-white font-semibold text-sm">${m.label}</div>
                    <div class="text-gray-400 text-xs">${m.desc}</div>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
              Pourquoi cette formation est différente ?
            </h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">
              Pas de "Hello World" ni de contrôleurs basiques. Un contenu conçu pour des ingénieurs expérimentés.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            ${[
              { icon: '⚙️', title: 'Mécanique Interne', desc: 'Démystifiez l\'auto-configuration, le cycle de vie IoC et les profils Spring. Comprenez pour mieux configurer.' },
              { icon: '🔗', title: 'Écosystème Cloud-Native', desc: 'Microservices, résilience, sécurité Zero Trust, observabilité. L\'intégration complète dans le cloud.' },
              { icon: '📦', title: 'Production Ready', desc: 'CI/CD, conteneurisation, Kubernetes, GraalVM. Optimisez pour la production dès le départ.' }
            ].map(item => `
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div class="text-4xl mb-4">${item.icon}</div>
                <h3 class="text-xl font-bold text-white mb-3">${item.title}</h3>
                <p class="text-gray-400 leading-relaxed">${item.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div class="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-green-500/20">
            <div class="text-center">
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
                6 modules · 18 sections · Architecture moderne
              </h2>
              <p class="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Un parcours complet de la compréhension interne du framework jusqu\'au déploiement en production
              </p>
              <a href="#/module/module-1" class="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-200">
                Explorer les modules
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default Hero;
