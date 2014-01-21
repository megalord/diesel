(function(namespace) {

    // This is a generic singleton implementing a simple event system
    // that can be used standalone or to extend another object's prototype.
    var Events = {

        registry:{},

        // Add a callback function to the registry for an event.
        // This function will be called when the event is fired.
        on:function(event, callback, context) {
            if(!(event in this.registry))
                this.registry[event] = [];
            this.registry[event].push({
                callback:callback,
                context:context || this
            });
        },

        // Remove a callback function to the registry for an event.
        off:function(event, callback) {
            if(event in this.registry) {
                for(var i = 0, ilen = this.registry[event].length; i < ilen; i++) {
                    if(this.registry[event][i].callback === callback) {
                        this.registry[event].splice(i, 1);
                        break;
                    };
                };
            };
        },

        // Trigger an event, firing all registered callbacks.
        trigger:function(/* event [, args] */) {
            var args = Array.prototype.slice.call(arguments),
                event = args.shift();
            if(event in this.registry)
                for(var i = 0, ilen = this.registry[event].length; i < ilen; i++)
                    this.registry[event][i].callback.apply(this.registry[event][i].context, args);
        }

    };

    // Extend a destination object to include a source object's properties.
    var extend = function(dest, source) {
        for(var prop in source)
            dest[prop] = source[prop];
    };

    // Create a structure for data storage that uses getters, setters,
    // and an event system to dynamically synchronize related properties.
    var Model = {

        // Create a new object using the Model prototype.
        create:function() {
            var self = Object.create(this);
            self.data = {};
            extend(self, Events);
            return self;
        },

        // Define a property of the model
        // using a static value of generator function.
        define:function(property, value) {
            var dependencies, fn, fnStr, match, pattern;
            // If a function is used to define the property,
            // it is provided in the 'value' argument.
            if(typeof value === 'function') {
                fn = value;
                value = fn.call(this);
                // Extract the dependencies from all the 'get' calls inside the function.
                dependencies = [];
                fnStr = fn.toString();
                pattern = /this\.get\('(\w+)'\)/g;
                while(match = pattern.exec(fnStr))
                    if(dependencies.indexOf(match[1]) === -1)
                        dependencies.push(match[1]);
                // Listen for changes in the dependencies and re-run the generator function
                // so that the property's value is always up to date.
                for(var i = 0, ilen = dependencies.length; i < ilen; i++) {
                    this.on('changed:' + dependencies[i], function(value) {
                        this.set(property, fn.call(this));
                    });
                };
            };
            this.data[property] = value;
            // Return the model instance for chaining.
            return this;
        },

        // Retrieve a property of the model.
        get:function(property) {
            return this.data[property];
        },

        // Change the value of a property of the model.
        // Trigger a change event that may propogate to other properties.
        set:function(property, value) {
            if(property in this.data) {
                this.data[property] = value;
                this.trigger('changed:' + property, value, property);
            };
        }

    };

    namespace.Model = Model;

})(window);
