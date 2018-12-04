var diesel = (function(parent) {

  parent.Events = {

    _registry:{},

    extendTo:function(target) {
      for(var prop in this)
        target[prop] = this[prop];
    },

    // Add a callback function to the registry for an event.
    // This function will be called when the event is fired.
    on:function(event, callback, context) {
      if(Array.isArray(event)) {
        for(var i = 0; i < event.length; i++)
          this.on(event[i], callback, context);
        return;
      };

      if(!(event in this._registry))
        this._registry[event] = [];
      this._registry[event].push({
        callback:callback,
        context:context || this
      });
    },

    // This is the same idea as on(),
    // but the callback will be removed from the registry after it is run.
    once:function(event, callback, context) {
      var self = this,
        fn = function() {
          callback.apply(this, arguments);
          self.off(event, fn);
        };
      this.on(event, fn, context);
    },

    // Remove a callback function to the registry for an event.
    off:function(event, callback) {
      if(event in this._registry) {
        for(var i = 0, ilen = this._registry[event].length; i < ilen; i++) {
          if(this._registry[event][i].callback === callback) {
            this._registry[event].splice(i, 1);
            break;
          };
        };
      };
    },

    // Trigger an event, firing all registered callbacks.
    trigger:function(/* event [, args] */) {
      var args = Array.prototype.slice.call(arguments),
        event = args.shift();
      if(event in this._registry)
        for(var i = 0, ilen = this._registry[event].length; i < ilen; i++)
          this._registry[event][i].callback.apply(this._registry[event][i].context, args);
    }

  };

  return parent;

})(diesel || {});
