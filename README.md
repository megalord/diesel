# events

## description

The events object is a simple implementation of the PubSub pattern.

## methods

#### extendTo(target)

Copies the event functionality to another object.

#### on(event, callback [, context])

Register a callback for the given event. The event is created if it does not already exist.

The context can be added if the value of this inside the callback should be something other than the host object of the event system.

#### once(event, callback [, context])

The function is the same as on(), except the callback will be removed from the registry after the first time it is run.

#### off(event, callback)

Remove the callback for a given event, if it exists.

#### trigger(event [, args])

Trigger an event, running all the callbacks that are registered to it. The optional arguments are passed as parameters to each callback.

# router

## description

This script uses the history api or hashes to save and change the state of your single-page application.

The router parses a route sequentially, so navigation to a nested route will execute the callbacks (if defined) of parent routes before executing that of the child route.  This approach allows routes to easily be clustered by functionality.

For example, navigation to /dir1/dir2/page will execute the callbacks registered for /dir1, /dir1/dir2, and /dir1/dir2/page in that order.

The router can easily be attached to a namespace by modifying the argument of the IIFE on the last line of the file.  The default namespace is the window.

The test.html file provides a boilerplate example and a playground for testing.


## methods

#### config(settings)

Writes each key/value pair of the passed object literal to the private settings object used by the router.
Available settings:
* history (bool) = true -> If set to true, the router will use the history api. On startup, this value will be set to false if the history api is not available.

#### navigateTo(route)

Navigates to the provided route as a string.

#### when(route, callback)

Registers the route with a callback function to be executed when the route is visited.  The route may have parameters that can be specified using a colon.  A route may have multiple of these parameters, and they will be available to the callback function in the form of an object literal that is passed as the first (and only) argument.

For example:
```javascript
router.when('posts/:id/edit', function(params) {
    // params.id returns the string in place of :id
});
```

#### start()

Ensures that the history api is available if set and attaches the change handler function to the onpopstate event.  To ensure expected behaviour of the router, this should be called after all calls to router.when() and router.config() and before all calls to router.navigateTo().

The start method will also call the change handler, effectively navigating to the current route and executing all the associated callback functions.  That way, the initial state of the page reflects the url.


# model

## description

The defined Model object is a prototype for creating individual data models in javascript.  The prototype is dependent on diesel's event system (diesel.Events).

The purpose is to facilitate live-updated computed properties using getters and setters as opposed to a 'jQuery soup' implementation.  A possible use-case would be replicating excel-like behaviour.

Instances of the model are made with the Model.create() method rather than a function constructor due to personal preference.

Currently, the model does not support complex data types.  That is, getting or setting the property 'obj.prop' does not create or read 'obj' and then look for 'prop' on it.

## methods

#### create()

Create a new model from the prototype.  This method is an alternative pattern to using function constructors, i.e. new Function().

#### define(property, value)

Define a property on the model.  The second parameter may be a static value or a function.  When using a function, other properties of the model must be requested using this.get('property').  For each of these calls, a change event is registered on the property being requested, and the defining function will be re-evaluated when such a change is triggered.

#### get(property)

Retrieve the value of a property on the model.

#### set(property, value)

Set the value of a property on the model.  Setting a new value will cause a change event to be triggered, which may propagate to dependent computed properties of the model.
