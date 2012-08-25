/**
 * The Choreographer
 *  Your server is my stage -- dirt simple URL routing for Node.js.
 *
 * by Han
 *
 * http://github.com/laughinghan/choreographer
 *
 */

var parse = require('url').parse;

//creates router
exports.router = function() {
  //router, to be passed to `require('http').createServer()`
  var router = function(req, res) {
    if (!(req.parsedUrl && 'pathname' in req.parsedUrl))
      req.parsedUrl = parse(req.url);
    if (req.method in routes) {
      var path = req.parsedUrl.pathname, routesForMethod = routes[req.method],
        len = routesForMethod.length;
      for (var i = 0; i < len; i += 1) {
        //say '/foo/bar/baz' matches '/foo/*/*'
        var route = routesForMethod[i], matches = route.exec(path);
        if (matches) { //then matches would be ['/foo/bar/baz','bar','baz']
          //so turn arguments from [req,res] into [req,res,'bar','baz']
          __Array_push.apply(arguments, matches.slice(1));
          return route.callback.apply(this, arguments);
        }
      }
    }
    //route not found: no route has matched and hence returned yet
    notFoundHandler.apply(this, arguments);
  };

  //dictionary of arrays of routes
  var routes = {};

  //routing API
  ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'TRACE', 'OPTIONS', 'CONNECT']
  .forEach(function(method) {
    routes[method] = [];

    //e.g. router.get('/foo/*',function(req,res,bar){});
    router[method.toLowerCase()] = function(route, ignoreCase, callback) {
      if (arguments.length === 2) {
        callback = ignoreCase;
        ignoreCase = router.ignoreCase;
      }

      if (route.constructor.name === 'RegExp') //instanceof fails between modules
        route = new RegExp(route); //if route is already a RegExp, just clone it
      else //else stringify and interpret as regex where * matches URI segments
        route = new RegExp('^' //and everything else matches literally
          + String(route)
            .replace(specialChars, '\\$&')
            .replace(/\*\*/g, '(.*)')
            .replace(/\*(?!\))/g, '([^/]*)') //negative lookahead so as not to
                                             //replace the '*' in '(.*)'
          + '$',
          ignoreCase ? 'i' : ''
        );
      route.callback = callback;
      routes[method].push(route);

      return this;
    };
  });
  //special characters that need to be escaped when passed to `RegExp()`, lest
  //they be interpreted as pattern-matching:
  var specialChars = /[|.+?{}()\[\]^$]/g;

  //creating `get` routes automatically creates `head` routes:
  routes.GET.push = function(route) { //as called by `router.get()`
    __Array_push.call(this, route);
    routes.HEAD.push(route);
  };

  //404 is a route too
  router.notFound = function(handler) {
    notFoundHandler = handler;
    return this;
  };

  //handles requests where no matching route is found
  var notFoundHandler = defaultNotFound;

  return router;
};
var __Array_push = [].push; //Array.prototype.push, used by `router()`

function defaultNotFound(req, res) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<html><head><title>Error 404: Not Found</title></head><body>\n' +
    '<h1>Error 404: Not Found</h1>\n' +
    '<p>Cannot ' + req.method + ' ' + req.url + '</body></html>\n');
}
