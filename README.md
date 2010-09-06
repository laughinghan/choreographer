Please note that this is an alpha version, so bugs and unimplemented features
are all over the place.

Usage
-----

(Note: Only been tested on Node.js v0.2.0.)

Dirt simple:

    require('choreographer').exportTo(this);
    get('/', function(request, response)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    });
    serve(require('http')).listen(80);

If you want to avoid polluting the global namespace:

    var router = require('choreographer');
    router.get('/', function(request, response)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    });
    serve(require('http')).listen(80);

If you want a server that does more than route:

    require('choreographer').exportTo(this);
    get('/', function(request, response)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    });
    require('http').createServer(function(req, res)
    {
      choreograph.apply(this, arguments);
      //serve stuff
    }).listen(80);

Understanding The Code
----------------------

All the exports are at the beginning, all the functions are declarations.

Open-Source License
-------------------

[GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
