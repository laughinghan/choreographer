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
exports.setNotFound = setNotFound;
exports.resetNotFound = resetNotFound;

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
  routes[req.method].forEach(function(route)
  {
    var matches = url.match(route);
    if(matches === null)
      continue;
    var match_names = route.matches,
      params = arguments[arguments.length] = match_names ? {} : [];
    if(match_names)
      matches.forEach(function(match, i){ params[match_names[i]] = match; });
    else
      matches.forEach(function(match, i){ params[i] = match; });
    return route.call.apply(this, arguments);
  });
  //route not found
  notFound.apply(this, arguments);
}

//handles requests where no matching route is found
var notFound = defaultNotFound;

function setNotFound(fn)
{
  notFound = fn;
}
function resetNotFound(fn)
{
  notFound = defaultNotFound;
}
function defaultNotFound(req, res)
{
  res.writeHead(404, 'Not Found', { 'Content-Type': 'text/html' });
  res.end('<html><head><title>Error 404: Not Found</title></head><body>' +
    '<h1>Error 404: Not Found</h1>' +
    '<p>Cannot ' + req.method + ' ' + req.url + '</body></html>');
}

var routes = {}; //dictionary of arrays of routes

['HEAD', 'GET', 'POST', 'PUT', 'DELETE']
.forEach(function(method)
{
  routes[method] = [];

  exports[method.toLowerCase()] =
  exports[method] =
  function(route, callback)
  {
    if(route instanceof RegExp)
      route = new RegExp(route);
    else
    {
      var matches = [];
      route = new RegExp('^'+String(route).replace(named_routes, function(str, name){
        matches.push(name);
        return named_route_group;
      }));
    }
    route.call = callback;
    routes[method].push(route);
  };
});
var named_routes = /:([a-z_$][a-z0-9_$]*)/ig, named_route_group = '([a-zA-Z0-9_.~+\-]*)';
