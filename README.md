Choreographer
=============

Your server is my stage -- dirt simple URL routing for Node.js. Easy to use,
easy to understand. Sinatra-style API.

(This only being actively tested Node.js v0.2.0, but there's no reason it
wouldn't work on anything else.)

Install
-------

Get [npm](http://github.com/isaacs/npm#readme) if you don't already have it,
and then just run `sudo npm install choreographer` (`sudo` may be unnecessary).

Usage
-----

Dirt simple:

    var http = require('http'),
      router = require('choreographer').router();
    
    router.get('/chatroom/*/messages', function(req, res, room)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('No messages in ' + room + '.\n');
    });
    
    router.post('/chatroom/*/message', function(req, res, room)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Posted message to ' + room + '.\n');
    });
    
    router.notFound(function(req, res)
    {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404: This server is just a skeleton for a chat server.\n' +
        'I\'m afraid ' + req.url + ' cannot be found here.\n');
    });
    
    http.createServer(router).listen(80);

You can easily make routes case-insensitive with the optional `ignoreCase` flag:

    router.get('/HelloWorld', true, function(req, res)
    {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello, World!\n');
    });

Routes default to case-sensitive without the flag, but you can change that:

    //routes defined up until now defaulted to case-sensitive if flag omitted
    router.ignoreCase = true;
    //routes defined following default to case-insensitive if flag omitted

You can also pass in a regular expression as a route:

    router.get(/^\/hw(\d+)$/i, function(req, res, hwNum)
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

Notice that `router` is just an event listener for the `request` event on
`http.createServer`, so if you want a listener that does more than routing:

    http.createServer(function(req, res)
    {
      //do middleware stuff before routing
      router.apply(this, arguments);
      //do more stuff
    }).listen(80);

Understanding The Code
----------------------

The code is just as simple: first half is the router, second half is the routes.
Lightweight and easy to understand.

The entire architecture is designed around the philosophy of being so simple
it obviously has no bugs, rather than so complicated it has no obvious bugs.

Open-Source License
-------------------

[GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
