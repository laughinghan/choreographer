/**
 * The Choreographer
 *  Your server is my stage -- dirt simple URL routing for Node.js.
 *
 * by Han
 *
 * http://github.com/laughinghan/choreographer
 *
 */

//export the Choreographer module's API to `api`
exports.exportTo = function(api)
{
  for(var method in exports)
    api[method] = exports[method];
};

//shortcut for `http.createServer(choreography)`
exports.serve = function(http)
{
  return http.createServer(exports.choreography);
};

//to be passed to `require('http').createServer()`
exports.choreography = function(req, res)
{
  var url = req.url, _routes = routes[req.method];
  for(var route in _routes)
  {
    route = _routes[route]; //I don't want the damn index!

    var matches = url.match(route);
    if(matches) //say '/foo/asdf/jkl' has matched '/foo/*/*'
    {
      //then turn arguments from [req,res] into [req,res,'asdf','jkl']
      __Array_push.apply(arguments, matches);
      return route.callback.apply(this, arguments);
    }
  }
  //route not found: no route has matched and hence returned yet
  notFoundHandler.apply(this, arguments);
};
var __Array_push = [].push;

//dictionary of arrays of routes
var routes = {};

//routing API
['HEAD', 'GET', 'POST', 'PUT', 'DELETE']
.forEach(function(method)
{
  routes[method] = [];

  exports[method.toLowerCase()] =
  exports[method] =
  function(route, callback) //e.g. router.get('/foo/*',function(req,res,bar){});
  {
    if(route instanceof RegExp) //if supplied route is already a RegExp,
      route = new RegExp(route); //just clone it
    else //else stringify and interpret as regex where * matches URI segments
      route = new RegExp('^' + //and everything else matches literally
        String(route).replace(specialChars, '\\$&').replace('*', '([^/?#]*)')
      + '(?:[?#].*)?$');
    route.callback = callback;
    routes[method].push(route);
  };
});
//special characters that need to be escaped when passed to `RegExp()`, lest
//they be interpreted as pattern-matching:
var specialChars = /[|.+?{}()\[\]^$]/g;

//404 is a route too
exports.notFound = function(handler)
{
  notFoundHandler = handler;
};

//handles requests where no matching route is found
var notFoundHandler = function(req, res)
{
  res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html' });
  res.end('<html><head><title>Error 404: Not Found</title></head><body>' +
    '<h1>Error 404: Not Found</h1>' +
    '<p>Cannot ' + req.method + ' ' + req.url + '</body></html>');
};
