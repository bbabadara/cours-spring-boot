import DomUtils from '../utils/dom.js';
import { MODULES } from '../data/modules.js';

class Navigation {
  constructor(router) {
    this.router = router;
    this.menuOpen = false;
    this.render();
    this.bindEvents();
  }

  render() {
    const nav = DomUtils.$('nav');
    if (!nav) {
      console.warn('[Navigation] <nav> introuvable dans le DOM');
      return;
    }
    const linksHtml = MODULES.map(m => `
      <a href="#/module/${m.id}" class="nav-link text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200" data-nav="${m.id}">
        <span class="mr-1">${m.icon}</span>
        ${m.title.split(' ').slice(0, 3).join(' ')}...
      </a>
    `).join('');

    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="#/" class="flex items-center space-x-2 text-white font-bold text-lg">
            <svg class="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.963 1.065L1.279 3.917a.5.5 0 00-.376.484v12.168a.5.5 0 00.401.488l9.667 2.21a.5.5 0 00.595-.316l4.286-13.687a.5.5 0 00-.467-.646h-2.089l-2.668 7.723-2.067-6.356h2.356l1.224 3.854 1.572-5.323H4.99l1.05 3.229 2.284-6.695a.5.5 0 00-.361-.651z"/>
            </svg>
            <span>Spring Boot <span class="text-green-400">Academy</span></span>
          </a>

          <div class="hidden md:flex items-center space-x-1">
            ${linksHtml}
          </div>

          <button id="menu-toggle" class="md:hidden text-gray-300 hover:text-white p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <div id="mobile-menu" class="hidden md:hidden bg-gray-800 border-t border-gray-700">
        <div class="px-2 pt-2 pb-3 space-y-1">
          ${MODULES.map(m => `
            <a href="#/module/${m.id}" class="nav-link block text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium" data-nav="${m.id}">
              ${m.icon} ${m.title}
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const toggle = DomUtils.$('#menu-toggle');
    const mobileMenu = DomUtils.$('#mobile-menu');

    if (toggle) {
      toggle.addEventListener('click', () => {
        this.menuOpen = !this.menuOpen;
        mobileMenu.classList.toggle('hidden', !this.menuOpen);
      });
    }

    DomUtils.$$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (this.menuOpen) {
          this.menuOpen = false;
          mobileMenu.classList.add('hidden');
        }
      });
    });

    window.addEventListener('hashchange', () => this.updateActive());
    this.updateActive();
  }

  updateActive() {
    const hash = window.location.hash;
    DomUtils.$$('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
      link.classList.toggle('bg-white/10', link.getAttribute('href') === hash);
      link.classList.toggle('text-white', link.getAttribute('href') === hash);
    });
  }
}

export default Navigation;
