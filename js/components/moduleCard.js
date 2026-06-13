import DomUtils from '../utils/dom.js';

class ModuleCard {
  render(module) {
    return DomUtils.create('a', {
      href: `#/module/${module.id}`,
      className: `group block bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2`
    }, [
      DomUtils.create('div', { className: 'flex items-center justify-between mb-4' }, [
        DomUtils.create('span', { className: 'text-4xl' }, [module.icon]),
        DomUtils.create('span', {
          className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${module.color} text-white`
        }, [`Module ${module.number}`])
      ]),
      DomUtils.create('h3', { className: 'text-xl font-bold text-white mb-2' }, [module.title]),
      DomUtils.create('p', { className: 'text-gray-400 text-sm mb-4 leading-relaxed' }, [module.subtitle]),
      DomUtils.create('p', { className: 'text-gray-500 text-sm leading-relaxed line-clamp-3' }, [module.summary]),
      DomUtils.create('div', { className: 'mt-4 flex items-center text-green-400 text-sm font-medium' }, [
        DomUtils.create('span', {}, [`${module.sections.length} sections`]),
        DomUtils.create('svg', { className: 'w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
          DomUtils.create('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 8l4 4m0 0l-4 4m4-4H3' })
        ])
      ])
    ]);
  }

  renderGrid(container, modules) {
    const grid = DomUtils.create('div', {
      className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'
    });
    modules.forEach(m => grid.appendChild(this.render(m)));
    container.appendChild(grid);
  }
}

export default ModuleCard;
