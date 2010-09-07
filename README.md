Please note that this is an alpha version, so bugs and unimplemented features
are all over the place.

(This only being actively tested Node.js v0.2.0, but there's no reason it
wouldn't work on anything else.)

Usage
-----

Dirt simple:

    var http = require('http');
    require('choreographer').exportTo(this);
    get('/', function(request, response)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    });
    serve(http).listen(80);

As in Sinatra, the callback for the first route a request matches is invoked,
and routes are matched in the order they are defined.

If you want to avoid polluting the global namespace, don't call `.exportTo()`:

    var http = require('http'), router = require('choreographer');
    router.get('/', function(request, response)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    });
    router.serve(http).listen(80);

`serve` is just a shortcut, so if you want a server that does more than route:

    var http = require('http');
    require('choreographer').exportTo(this);
    get('/', function(request, response)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hello World\n');
    });
    http.createServer(function(req, res)
    {
      //serve stuff
      choreograph.apply(this, arguments);
      //serve more stuff
    }).listen(80);

Easy to use.

Understanding The Code
----------------------

All the exports are at the beginning, all the functions are declarations.

The entire architecture is designed around the philosophy of being so simple
it obviously has no bugs, rather than so complicated it has no obvious bugs.

Easy to understand.

Open-Source License
-------------------

[GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
