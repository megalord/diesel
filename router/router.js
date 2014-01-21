(function(namespace) {

    // the encapusating object for the router
    // which will be added to the namespace object
    var router = {},

    // a registry of all the routes
    // child routes can be accessed by routes.subdirectory.page
        routes = {},

    // store settings for the router
        settings = {
            history:true
        },

    // executes the function(s) for a route
    // and all of it's parent routes, if any are found
    parse = function(route) {
        var base = '',
            matchingRoutes = Object.keys(routes),
            params = {},
            partial = '/',
            parts = route.split('/').slice(1),
            prefix = '';

        // handle exception for the index route, which is passed as single slash
        if(route === '/' && 'index' in routes) routes['index']();

        // sequentially build the full route from its parts,
        // checking for sub-route callbacks at each step
        // and populating the params object if necessary
        for(var i = 0, ilen = parts.length; i < ilen; i++) {
            // update the partial route string
            base = partial + prefix;
            partial = base + parts[i];

            // reflect the changes to the partial route in the array of filtered routes
            matchingRoutes = matchingRoutes.filter(function(route) {
                return route.indexOf(base) === 0;
            });

            if(partial in routes) {
                routes[partial](params);
            } else {
                // search for a route with a parameter,
                // which can be identified by a ':' character after the '/'
                var found = false,
                    param = '';
                for(var j = 0, jlen = matchingRoutes.length; j < jlen; j++) {
                    if(matchingRoutes[j].charAt(base.length) === ':') {
                        found = true;
                        break;
                    };
                };
                if(found) {
                    param = matchingRoutes[j].slice(base.length + 1).split('/')[0];
                    params[param] = parts[i];

                    // fix the partial route string
                    partial = base + ':' + param;
                    routes[partial](params);
                };
            };

            // the prefix for the next part of the route
            // should be a '/' character for every iteration
            // but the first
            // e.g. sub1 /sub2 /page   <- spaces added for demonstration
            prefix = '/';
        };
    },

    routeChangeHandler = function() {
        var route = location[settings.history ? 'pathname' : 'hash'];

        // remove everything up to and including the first '/' character
        route = route.slice(route.indexOf('/'));

        // parse the route
        parse(route);
    };

    // configure the router's settings
    // should be called before start for expected operation
    router.config = function(newSettings) {
        for(var prop in newSettings) {
            settings[prop] = newSettings[prop];
        };
    };

    // programatically navigate to a route
    router.navigateTo = function(route) {
        if(settings.history) {
            history.pushState(null, '', route);
            routeChangeHandler();
        } else {
            location.hash = route;
        };
    };

    // startup function for the router
    router.start = function() {
        // ensure that the history api is available if it is used
        if(settings.history && !('history' in window)) settings.history = false;

        // attach the handler to the change event
        // and call it to get the resources for the initial route
        window.onpopstate = routeChangeHandler;
        routeChangeHandler();
    };

    // assign a callback function to a route
    router.when = function(route, callback) {
        routes[route] = callback;
        return this;
    };

    // finally, attach the router object to the namespace
    namespace.router = router;

})(window);
