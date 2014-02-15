var diesel = (function(parent) {

parent.Model = {

    // Create a new object using the Model prototype.
    create:function(data) {
        var self = Object.create(this);
        parent.Events.extendTo(self);
        self.defineMany(data);
        return self;
    },

    define:function(property, value) {
        var fnStr, match,
            dependencies = Array.prototype.slice.call(arguments, 2),
            pattern = /this\.([\w\.]+)/g,
            self = this;

        Object.defineProperty(this, property, {
            configurable:false,
            enumerable:true,
            get:typeof value === 'function' ? value.bind(self) : function() { return value; },
            set:function(newValue) {
                value = newValue;
                self.trigger('changed:' + property, self[property], property);
            }
        });

        if(typeof value === 'function') {
            // Extract the dependencies from all the references to 'this' inside the function.
            fnStr = value.toString();
            while(match = pattern.exec(fnStr))
                if(dependencies.indexOf(match[1]) === -1)
                    dependencies.push(match[1]);

            // Listen for changes in the dependencies to propogate events.
            for(var i = 0, ilen = dependencies.length; i < ilen; i++) {
                this.on('changed:' + dependencies[i], function() {
                    this.trigger('changed:' + property, this[property], property);
                });
            };
        };

        return this;
    },

    defineMany:function(data) {
        for(var prop in data)
            this.define(prop, data[prop]);
    }
};

return parent;

})(diesel || {});
