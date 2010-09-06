/**
 * The Choreographer
 *  Your server is my stage -- dirt simple URL routing for Node.js.
 *
 * by Han
 *
 * http://github.com/laughinghan/choreographer
 *
 */

exports.serve = serve;
exports.choreograph = choreograph;
exports.exportTo = exportTo;

//shortcut for `http.createServer(choreograph)`
function serve(http)
{
  return http.createServer(choreograph);
}

//to be passed to `require('http').createServer()`
function choreograph(request, response)
{
  for(var route in routes[request.method])
    if(route.path.match(request.url))
    {
      route.call.apply(this, arguments);
      break;
    }
}

//export the Choreographer module's API to `api`
function exportTo(api)
{
  for(var method in Object.keys(exports))
    api[method] = exports[method];
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
