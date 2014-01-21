# simple spa router

## description

This script uses the history api or hashbangs to save and change the state of your single-page application.

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
