Choreographer
=============

Your server is my stage -- dirt simple URL routing for Node.js. Easy to use,
easy to understand. Sinatra-style API.

(This only being actively tested Node.js v0.2.0, but there's no reason it
wouldn't work on anything else.)

Usage
-----

Dirt simple:

    var http = require('http'),
      server = require('choreographer').server();
    
    server.get('/chatroom/*/messages', function(req, res, room)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('No messages in ' + room + '.\n');
    });
    
    server.post('/chatroom/*/message', function(req, res, room)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Posted message to ' + room + '.\n');
    });
    
    server.notFound(function(req, res)
    {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404: This server is just a skeleton for a chat server.\n' +
        'I\'m afraid ' + request.url + ' cannot be found here.\n');
    });
    
    http.createServer(server).listen(80);

You can easily make the routes case-insensitive:

    server.get('/HelloWorld', function(req, res)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello, World!\n');
    });
    
    server.ignoreCase = true;
    //the '/HelloWorld' route above will still be case-sensitive
    
    //boolean flag makes this route case-sensitive anyway
    server.get('/HelloAgainWorld', false, function(req, res)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello Again, World!\n');
    });

You can also pass in a regular expression as a route:

    server.get(/^\/hw(\d+)$/i, function(req, res, hwNum)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Homework '+hwNum+' isn\'t available yet.\n');
    });

There's also `put`, `delete` and `head`, and that's it! That's the entire API,
simple and easy to use.

As in Sinatra, routes are first-come, first-serve (only the callback for the
first route to be matched by a request is invoked, and routes are matched in the
order they are defined). Also as in Sinatra, creating `get` routes automatically
creates `head` routes.

Notice that `server` is just an event listener for the `request` event on
`http.createServer`, so if you want a listener that does more than routing:

    http.createServer(function(req, res)
    {
      //do middleware stuff before routing
      server.apply(this, arguments);
      //do more stuff
    }).listen(80);

Understanding The Code
----------------------

The code is just as simple: starts out with shortcuts, then a basic routing
server, and finally the routes. Lightweight and easy to understand.

The entire architecture is designed around the philosophy of being so simple
it obviously has no bugs, rather than so complicated it has no obvious bugs.

Open-Source License
-------------------

[GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
