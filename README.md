Please note that this is an alpha version, so bugs and unimplemented features
are all over the place.

(This only being actively tested Node.js v0.2.0, but there's no reason it
wouldn't work on anything else.)

Usage
-----

Dirt simple:

    var http = require('http');
    require('choreographer').exportTo(this);
    
    get('/chatroom/*/messages', function(request, response, room)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('No messages in ' + room + '.\n');
    });
    
    post('/chatroom/*/message', function(request, response, room)
    {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Posted message to ' + room + '.\n');
    });
    
    notFound(function(request, response)
    {
      response.writeHead(404, {'Content-Type': 'text/plain'});
      response.end('404: This server is just a skeleton for a chat server.\n' +
        'I\'m afraid ' + request.url + ' cannot be found here.\n');
    });
    
    serve(http).listen(80);

As in Sinatra, routes are first-come, first-serve (only the callback for the
first route to be matched by a request is invoked, and routes are matched in the
order they are defined).

If you want to avoid polluting the global namespace, don't call `.exportTo()`:

    var http = require('http'),
      router = require('choreographer');
    
    router.get('/hw*', function(req, res, hwNum)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Homework ' + hwNum + ' isn\'t up yet.\n');
    });
    
    router.serve(http).listen(80);

`serve` is just a shortcut, so if you want a server that does more than route:

    var http = require('http');
    require('choreographer').exportTo(this);
    
    notFound(function(req, res)
    {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('Error 404: Not Found\n' +
        'Actually nothing can be found on this server. It\'s just an example.');
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

The code is pretty simple: starts out with shortcuts, then the very simple
routing server, and finally the routes.

The entire architecture is designed around the philosophy of being so simple
it obviously has no bugs, rather than so complicated it has no obvious bugs.

Easy to understand.

Open-Source License
-------------------

[GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
