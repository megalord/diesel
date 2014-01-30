// The model is dependent on diesel.Events

var diesel = (function(parent) {

parent.Model = {

    // Create a new object using the Model prototype.
    create:function() {
        var self = Object.create(this);
        self._data = {};
        parent.Events.extendTo(self);
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
        this._data[property] = value;
        // Return the model instance for chaining.
        return this;
    },

    // Retrieve a property of the model.
    get:function(property) {
        return this._data[property];
    },

    // Change the value of a property of the model.
    // Trigger a change event that may propogate to other properties.
    set:function(property, value) {
        if(property in this._data) {
            this._data[property] = value;
            this.trigger('changed:' + property, value, property);
        };
    }

};

return parent;

})(diesel || {});
