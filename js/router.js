class Router {
  constructor(routes, outletSelector) {
    this.routes = routes;
    this.outlet = document.querySelector(outletSelector);
    this.currentRoute = null;
    this.params = {};
    window.addEventListener('hashchange', () => this.resolve());
  }

  register(route) {
    this.routes.push(route);
  }

  navigate(path) {
    window.location.hash = path;
  }

  getHash() {
    return window.location.hash.slice(1) || '/';
  }

  resolve() {
    const hash = this.getHash();
    for (const route of this.routes) {
      const match = this.matchRoute(route.path, hash);
      if (match !== null) {
        this.params = match;
        this.currentRoute = route;
        route.handler(this.outlet, this.params);
        return;
      }
    }
    const notFound = this.routes.find(r => r.path === '/404');
    if (notFound) notFound.handler(this.outlet, {});
  }

  matchRoute(pattern, hash) {
    const patternParts = pattern.split('/');
    const hashParts = hash.split('/');
    if (patternParts.length !== hashParts.length) return null;
    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = hashParts[i];
      } else if (patternParts[i] !== hashParts[i]) {
        return null;
      }
    }
    return params;
  }

  start() {
    this.resolve();
  }
}

export default Router;
