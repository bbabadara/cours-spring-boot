const DomUtils = {
  $: (selector, context = document) => context.querySelector(selector),
  $$: (selector, context = document) => [...context.querySelectorAll(selector)],
  create: (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') el.className = value;
      else if (key === 'innerHTML') el.innerHTML = value;
      else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key === 'dataset') Object.assign(el.dataset, value);
      else el.setAttribute(key, value);
    });
    children.forEach(child => {
      if (typeof child === 'string') el.appendChild(document.createTextNode(child));
      else if (child instanceof Node) el.appendChild(child);
    });
    return el;
  },
  htmlToElements: (html) => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.childNodes;
  },
  appendHTML: (el, html) => {
    el.insertAdjacentHTML('beforeend', html);
  },
  empty: (el) => { el.innerHTML = ''; },
  scrollTo: (el, behavior = 'smooth') => {
    el.scrollIntoView({ behavior, block: 'start' });
  }
};

window.SB = window.SB || {};
window.SB.DomUtils = DomUtils;
