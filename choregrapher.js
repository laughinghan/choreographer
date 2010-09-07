/**
 * The Choreographer
 *  Your server is my stage -- dirt simple URL routing for Node.js.
 *
 * by Han
 *
 * http://github.com/laughinghan/choreographer
 *
 */

exports.exportTo = exportTo;
exports.serve = serve;
exports.choreograph = choreograph;

//export the Choreographer module's API to `api`
function exportTo(api)
{
  for(var method in exports)
    api[method] = exports[method];
}

//shortcut for `http.createServer(choreograph)`
function serve(http)
{
  return http.createServer(choreograph);
}

//to be passed to `require('http').createServer()`
function choreograph(req, res)
{
  var url = req.url;
  for(var route in routes[req.method])
  {
    route = routes[req.method][route];
    var matches = url.match(route);
    if(matches) //say '/foo/asdf/jkl' has matched '/foo/:bar/:baz'
    {
      var match_names = route.match_names, //then match_names is ['bar','baz']
        params = match_names ? {} : []; //use array if orig. regex (see routes)
      if(match_names)
        matches.forEach(function(match, i){ params[match_names[i]] = match; });
      else
        matches.forEach(function(match, i){ params[i] = match; });
      //now params will be {bar: 'asdf', baz: 'jkl'}
      [].push.call(arguments, params); //arguments becomes [req, res, params]
      return route.call.apply(this, arguments);
    }
  }
  //route not found
  notFound.apply(this, arguments);
}

//handles requests where no matching route is found
var notFound = defaultNotFound;

function setNotFound(fn)
{
  notFound = fn;
}
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

var routes = {}; //dictionary of arrays of routes

['HEAD', 'GET', 'POST', 'PUT', 'DELETE']
.forEach(function(method)
{
  routes[method] = [];

  exports[method.toLowerCase()] =
  exports[method] =
  function(route, callback)
  {
    if(route instanceof RegExp) //if supplied route is already a RegExp,
      route = new RegExp(route); //just clone it and leave match_names undefined
    else
    {
      route = new String(route);
      //get ['bar', 'baz'] from '/foo/:bar/:baz'
      var match_names = route.match(named_routes).map(function(name){
        return name.slice(1); //slice off colon
      });
      //turn '/foo/:bar/:baz' into /^\/foo\/([^/?#]*)/([^/?#]*)$/
      route = new RegExp('^' + route.replace(named_routes, named_route_group) +
        '(?:[?#].*)?$');
    }
    route.match_names = match_names;
    route.call = callback;
    routes[method].push(route);
  };
});
var named_routes = /:([a-z_$][a-z0-9_$]*)/ig, //allow any JavaScript identifier
  named_route_group = '([^/?#]*)'; //allowed URI segment characters
