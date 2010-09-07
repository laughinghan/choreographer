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
    if(route.path.match(req.url))
      return route.call.apply(this, arguments);
  routes[req.method].forEach(function(route)
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
  function(path, callback)
  {
    routes[method].push({
      path: path,
      call: callback
    });
  };
});
