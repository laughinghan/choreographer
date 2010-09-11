/**
 * The Choreographer
 *  Your server is my stage -- dirt simple URL routing for Node.js.
 *
 * by Han
 *
 * http://github.com/laughinghan/choreographer
 *
 */

//creates router
exports.server = function()
{
  //routing server, to be passed to `require('http').createServer()`
  var server = function(req, res)
  {
    var url = req.url, _routes = routes[req.method], len = _routes.length;
    for(var i = 0; i < len; i += 1)
    {
      //say '/foo/bar/baz' matches '/foo/*/*'
      var route = _routes[i], matches = route.exec(url);
      if(matches) //then matches would be ['/foo/bar/baz','bar','baz']
      {
        //so turn arguments from [req,res] into [req,res,'bar','baz']
        __Array_push.apply(arguments, matches.slice(1));
        return route.callback.apply(this, arguments);
      }
    }
    //route not found: no route has matched and hence returned yet
    notFoundHandler.apply(this, arguments);
  };

  //dictionary of arrays of routes
  var routes = {};

  //routing API
  ['HEAD', 'GET', 'POST', 'PUT', 'DELETE']
  .forEach(function(method)
  {
    routes[method] = [];

    //e.g. server.get('/foo/*',function(req,res,bar){});
    server[method.toLowerCase()] = function(route, callback)
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

  //creating `get` routes automatically creates `head` routes:
  routes.GET.push = function(route) //as called by `server.get()`
  {
    __Array_push.call(this, route);
    routes.HEAD.push(route);
  };

  //404 is a route too
  server.notFound = function(handler)
  {
    notFoundHandler = handler;
  };

  //handles requests where no matching route is found
  var notFoundHandler = defaultNotFound;

  return server;
};
var __Array_push = [].push; //Array.prototype.push, used by `server()`

function defaultNotFound(req, res)
{
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<html><head><title>Error 404: Not Found</title></head><body>\n' +
    '<h1>Error 404: Not Found</h1>\n' +
    '<p>Cannot ' + req.method + ' ' + req.url + '</body></html>\n');
}
