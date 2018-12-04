var diesel = (function(parent) {

  parent.Model = {

    // Create a new object using the Model prototype.
    create:function(data) {
      var self = Object.create(this);

      // Extend the model with the events.
      if(!('Events' in parent))
        throw new Error('Model requires diesel.Events.');
      parent.Events.extendTo(self);

      // Define the data on the new model if any has been passed.
      if(typeof data === 'object' && Object.keys(data).length > 0)
        self.define(data);

      return self;
    },

    define:function(property, value) {
      var fn, fnStr, match,
        dependencies = Array.prototype.slice.call(arguments, 2),
        pattern = /this\.([\w\.]+)/g,
        self = this;

      // The property argument is optionally an object containing multiple properties.
      if(typeof property === 'object') {
        for(var prop in property)
          this.define(prop, property[prop]);
        return;
      };

      if(typeof value === 'function') {
        fn = value;
        value = fn.call(this);
      };

      Object.defineProperty(this, property, {
        configurable:false,
        enumerable:true,
        get:function() { return value; },
        set:function(newValue) {
          if(newValue !== value) {
            value = newValue;
            self.trigger('changed:' + property, self[property], property);
          };
        }
      });

      // Add event listeners to the dependencies so that changes are propagated.
      if(typeof fn === 'function') {
        // Extract the dependencies from all the references to 'this' inside the function.
        fnStr = fn.toString();
        while(match = pattern.exec(fnStr))
          if(dependencies.indexOf(match[1]) === -1)
            dependencies.push(match[1]);

        // Listen for changes in the dependencies to propagate events.
        for(var i = 0, ilen = dependencies.length; i < ilen; i++) {
          this.on('changed:' + dependencies[i], function() {
            value = fn.call(this);
            this.trigger('changed:' + property, this[property], property);
          });
        };
      };

      return this;
    }

  };

  return parent;

})(diesel || {});
