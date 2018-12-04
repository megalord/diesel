function recurse(prefix, routes, pres) {
  if (routes.pre) {
    pres = pres.concat([routes.pre]);
  }

  let ret = {};
  for (let route in routes) {
    if (route === 'pre') {
      continue;
    }

    let path = route === 'self' ? prefix : (prefix + route);
    if (routes[route].constructor === Function) {
      //ret[path] = (params) => console.log(path, params, pres.concat([routes[route]]));
      ret[path] = (params) => pres.concat([routes[route]]).every((fn) => fn(params) !== false);
    } else if (route === 'self') {
      throw new TypeError(`groupedRoutes for self on ${path} must be a Function, got ${routes.constructor}`);
    } else if (routes[route].constructor === Object) {
      Object.assign(ret, recurse(path, routes[route], pres));
    } else {
      throw new TypeError(`groupedRoutes for path ${path} expected Function or Object, got ${routes[route].constructor}`);
    }
  }
  return ret;
};

export default function groupedRoutes(routes) {
  if (routes.constructor !== Object) {
    throw new TypeError(`groupedRoutes expected Object, got ${routes.constructor}`);
  }

  return recurse('', routes, []);
}
