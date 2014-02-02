var diesel = (function(parent) {

parent.router = {

    _started:false,

    _routes:{},

    _settings:{
        history:true,
        onError:function(route) {
            throw new Error('Route does not exist.', route);
        }
    },

    // Executes the function(s) for a route
    // and all of it's parent routes, if any are found.
    _parse:function(route) {
        var base = '',
            found = false,
            isValid = false,
            matchingRoutes = Object.keys(this._routes),
            param = '',
            params = {},
            partial = '/',
            parts = route.split('/').slice(1),
            prefix = '';

        // Provide a general hook for all routes.
        if('*' in this._routes) this._routes['*'](route);

        // Sequentially build the full route from its parts,
        // checking for sub-route callbacks at each step
        // and populating the params object if necessary.
        for(var i = 0, ilen = parts.length; i < ilen; i++) {
            // Update the partial route string.
            base = partial + prefix;
            partial = base + parts[i];

            // Reflect the changes to the partial route in the array of filtered routes.
            matchingRoutes = matchingRoutes.filter(function(route) {
                return route.indexOf(base) === 0;
            });

            if(partial in this._routes) {
                this._routes[partial](params);
                isValid = true;
            } else {
                // Search for a route with a parameter,
                // which can be identified by a ':' character after the '/'.
                found = false;
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

                    // Fix the partial route string.
                    partial = base + ':' + param;
                    if(partial in this._routes) {
                        this._routes[partial](params);
                        isValid = true;
                    } else {
                        isValid = false;
                    };
                } else {
                    isValid = false;
                };
            };

            // The prefix for the next part of the route
            // should be a '/' character for every iteration but the first.
            // e.g. sub1 /sub2 /page   <- spaces added for demonstration
            prefix = '/';
        };
        if(!isValid) this._settings.onError(route);
    },

    _routeChangeHandler:function() {
        var route = location[this._settings.history ? 'pathname' : 'hash'];

        // Remove everything up to and including the first '/' character.
        route = route.slice(route.indexOf('/'));

        // A fix for the index page when the url hash is used but not set.
        if(route === '') route = '/';

        this._parse(route);
    },

    // Configure the router's settings.
    // This should be called before start() for expected operation.
    config:function(newSettings) {
        for(var prop in newSettings) {
            this._settings[prop] = newSettings[prop];
        };
        return this;
    },

    // Programatically navigate to a route.
    navigateTo:function(route) {
        if(!this._started) {
            throw new Error('Attempted to navigate before starting router.');
            return false;
        };

        if(this._settings.history) {
            history.pushState(null, '', route);
            this._routeChangeHandler();
        } else {
            location.hash = route;
        };
    },

    // Start monitoring history or hash changes.
    start:function() {
        this._started = true;

        // Ensure that the history api is available if it is used.
        if(this._settings.history && !('history' in window))
            this._settings.history = false;

        // Attach the handler to the change event
        // and call it to get the resources for the initial route.
        window.onpopstate = function() {
            diesel.router._routeChangeHandler;
        };
        this._routeChangeHandler();
    },

    stop:function() {
        this._started = false;
        window.onpopstate = function() {};
    },

    // Assign a callback function to a route.
    when:function(route, callback) {
        this._routes[route] = callback;
        return this;
    }

};

return parent;

})(diesel || {});
