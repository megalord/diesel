let routes, settings;

let notFoundFn = function(path) {
  throw new Error(`No route matches ${path}`);
}

function matches(pathParts, routeParts) {
  if (pathParts.length !== routeParts.length) {
    return null;
  }

  let params = {};
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i][0] === ':') {
      params[routeParts[i].slice(1)] = pathParts[i];
    } else if (pathParts[i] !== routeParts[i]) {
      return null;
    }
  }

  return params;
}

function parse(path) {
  let params;
  let pathParts = path.split('/');

  for (let route in routes) {
    if (route === 'else') {
      continue;
    }

    params = matches(pathParts, route.split('/'));
    if (params) {
      return routes[route].bind(null, params);
    }
  }
  return notFoundFn.bind(null, path);
}

function routeChangeHandler() {
  let path;
  if (settings.history) {
    path = location.pathname;
    if (settings.base) {
      if (path.startsWith(settings.base)) {
        path = path.slice(settings.base.length);
      } else {
        console.warn(`Path '${path}' does not start with base '${settings.base}'`);
      }
    }
  } else {
    path = location.hash.slice(2); // starts with '#/'
  }

  path = '/' + path;

  parse(path)();
}

function router(_routes, _settings) {
  routes = _routes || {};
  settings = _settings || {};

  if ('else' in routes) {
    notFoundFn = routes.else;
  }

  if (!settings.base) {
    let baseEl = document.querySelector('base');
    if (baseEl) {
      settings.base = baseEl.getAttribute('href');
    }
  }
  if (!settings.base) {
    settings.base = '/';
  }

  if (!('history' in settings)) {
    settings.history = true;
  }

  if (settings.history) {
    document.addEventListener('click', function(event) {
      if (event.target.tagName != 'A' || event.ctrlKey || event.metaKey || ('button' in event && event.button != 0)) {
        return;
      }

      let href = event.target.getAttribute('href');
      if (!href || href.startsWith('http') || (href.startsWith('/') && settings.base)) {
        return;
      }

      event.preventDefault();
      router.go(href);
    });
  }

  window.onpopstate = routeChangeHandler;
  // Get the resources for the initial route.
  routeChangeHandler();
}

// Programatically navigate to a route.
router.go = function(route, options) {
  options || (options = {});

  if (!settings.history) {
    location.hash = route;
    return
  }

  if (route.startsWith('/')) {
    route = route.slice(1);
  }
  route = settings.base + route;

  history[options.replace ? 'replaceState' : 'pushState'](null, '', route);

  // Adding a state entry does not trigger the `popstate` window event.
  routeChangeHandler();
}

export default router;
