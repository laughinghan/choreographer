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
function exportTo(api)
{
  for(var method in exports)
    api[method] = exports[method];
}
exports.exportTo = exportTo;

//shortcut for `http.createServer(choreograph)`
function serve(http)
{
  return http.createServer(choreograph);
}
exports.serve = serve;

var routes = {}; //dictionary of arrays of routes

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
var specialChars = /[|.+?{}()\[\]^$]/g;
//special characters that need to be escaped when passed to `RegExp()`

//to be passed to `require('http').createServer()`
function choreograph(req, res)
{
  var url = req.url, _routes = routes[req.method];
  for(var route in _routes)
  {
    route = _routes[route];
    var matches = url.match(route);
    if(matches) //say '/foo/asdf/jkl' has matched '/foo/*/*'
    {
      __Array_push.apply(arguments, matches);
        //then arguments is now [req,res,'asdf','jkl']
      return route.callback.apply(this, arguments);
    }
  }
  //route not found
  notFoundHandler.apply(this, arguments);
}
var __Array_push = [].push;
exports.choreograph = choreograph;

//handles requests where no matching route is found
var notFoundHandler = defaultNotFound;

function defaultNotFound(req, res)
{
  res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html' });
  res.end('<html><head><title>Error 404: Not Found</title></head><body>' +
    '<h1>Error 404: Not Found</h1>' +
    '<p>Cannot ' + req.method + ' ' + req.url + '</body></html>');
}
function notFound(handler)
{
  notFoundHandler = handler;
}
exports.notFound = notFound;
