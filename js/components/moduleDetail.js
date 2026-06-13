import DomUtils from '../utils/dom.js';
import { MODULES } from '../data/modules.js';

class ModuleDetail {
  render(container, module) {
    container.innerHTML = `
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div class="relative overflow-hidden">
          <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
            <a href="#/" class="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors group">
              <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              Retour à l'accueil
            </a>

            <div class="flex items-center space-x-4 mb-6">
              <span class="text-5xl">${module.icon}</span>
              <div>
                <span class="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${module.color} text-white">
                  Module ${module.number}
                </span>
                <h1 class="text-3xl md:text-5xl font-bold text-white mt-3">${module.title}</h1>
                <p class="text-xl text-gray-400 mt-1">${module.subtitle}</p>
              </div>
            </div>

            <p class="text-gray-300 text-lg max-w-4xl leading-relaxed mb-8">
              ${module.summary}
            </p>

            <div class="flex flex-wrap gap-2 mb-12">
              ${module.sections.map(s => `
                <a href="#section-${s.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}" 
                   class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors border border-white/10">
                  ${s.title}
                </a>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div class="space-y-12">
            ${module.sections.map(section => this.renderSection(section)).join('')}
          </div>
        </div>

        ${this.renderKeyTakeaways(module)}

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div class="flex flex-wrap justify-between items-center gap-4 pt-8 border-t border-white/10">
            <div class="flex gap-4">
              ${this.renderPrevNext(module)}
            </div>
            <a href="#/" class="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border border-white/10">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    `;
  }

  renderSection(section) {
    const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `
      <div id="${sectionId}" class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 section-card scroll-mt-24">
        <div class="flex items-start space-x-4 mb-6">
          <div class="w-1 h-16 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full flex-shrink-0"></div>
          <div>
            <h2 class="text-2xl font-bold text-white">${section.title}</h2>
            <p class="text-green-400 font-medium mt-1">${section.desc}</p>
          </div>
        </div>

        <div class="prose prose-invert max-w-none text-gray-300 leading-relaxed mb-8">
          ${section.content.split('\n\n').map(p => `<p class="mb-4">${p.trim()}</p>`).join('')}
        </div>

        <div class="bg-white/5 rounded-xl p-6 mb-8 border border-white/5">
          <h4 class="text-sm font-semibold text-green-400 uppercase tracking-wider mb-4">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Points clés à retenir
          </h4>
          <ul class="space-y-2">
            ${section.details.map(d => `
              <li class="flex items-start">
                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"/>
                </svg>
                <span class="text-gray-300">${d}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        ${section.code ? `
          <div class="bg-gray-950 rounded-xl overflow-hidden border border-white/10">
            <div class="flex items-center justify-between px-4 py-2 bg-gray-900/50 border-b border-white/5">
              <div class="flex space-x-2">
                <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span class="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span class="text-xs text-gray-500 font-mono">java/yaml</span>
            </div>
            <pre class="p-4 overflow-x-auto"><code class="text-sm text-gray-200 font-mono leading-relaxed">${this.escapeHtml(section.code)}</code></pre>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderKeyTakeaways(module) {
    if (!module.keyTakeaways || module.keyTakeaways.length === 0) return '';
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div class="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-8 md:p-12 border border-green-500/20">
          <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
            <svg class="w-7 h-7 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Points clés du module
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            ${module.keyTakeaways.map(t => `
              <div class="flex items-start bg-white/5 rounded-xl p-4 border border-white/5">
                <svg class="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span class="text-gray-300 text-sm">${t}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  renderPrevNext(module) {
    const idx = MODULES.findIndex(m => m.id === module.id);
    const prev = idx > 0 ? MODULES[idx - 1] : null;
    const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;
    let html = '';
    if (prev) {
      html += `
        <a href="#/module/${prev.id}" class="group flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10">
          <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-left">
            <span class="block text-xs text-gray-400">Précédent</span>
            <span class="block text-sm font-medium">Module ${prev.number}</span>
          </span>
        </a>
      `;
    }
    if (next) {
      html += `
        <a href="#/module/${next.id}" class="group flex items-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10">
          <span class="text-right">
            <span class="block text-xs text-gray-400">Suivant</span>
            <span class="block text-sm font-medium">Module ${next.number}</span>
          </span>
          <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      `;
    }
    return html;
  }

  escapeHtml(code) {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

export default ModuleDetail;
