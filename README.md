Choreographer
=============

Your server is my stage -- dirt simple URL routing for Node.js. Easy to use,
easy to understand. Sinatra-style API.

(This has been tested with Node.js v0.2.0-v0.4.8. Should work with all
subsequent versions too.)

Install
-------

Get [npm](http://github.com/isaacs/npm#readme) if you don't already have it,
and then just run `npm install choreographer`.

Usage
-----

Dirt simple:

    var http = require('http'),
      router = require('choreographer').router();
    
    router.get('/chatroom/*/messages', function(req, res, room) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('No messages in ' + room + '.\n');
    })
    .post('/chatroom/*/message', function(req, res, room) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Posted message to ' + room + '.\n');
    })
    .notFound(function(req, res) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('404: This server is just a skeleton for a chat server.\n' +
        'I\'m afraid ' + req.url + ' cannot be found here.\n');
    });
    
    http.createServer(router).listen(80);

Routes are easily made case-insensitive with the optional `ignoreCase` flag:

    router.get('/HelloWorld', true, function(req, res) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Hello, World!\n');
    });

Routes default to case-sensitive without the flag, but you can change that:

    //routes defined up 'til now defaulted to case-sensitive if flag omitted
    router.ignoreCase = true;
    //routes defined following default to case-insensitive if flag omitted

A star `*` in a route matches anything up to a slash `/`, but if you want to
match slashes too you can simply use two stars `**`:

    router.get('/static/**', function(req, res, path) {
      serveStaticFiles(path); //path could be 'file.ext' or 'folders/file.ext'
    });

Most flexibly, regular expressions may also be used as routes:

    router.get(/^\/hw(\d+)$/i, function(req, res, hwNum) {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Homework '+hwNum+' isn\'t available yet.\n');
    });

There's also `put`, `delete`, `head`, `trace`, `options`, and `connect`, and
that's it! That's the entire API, short and sweet.

As in Sinatra, routes are first-come, first-serve (only the callback for the
first route to be matched by a request is invoked, and routes are matched in
the order they are defined). Also as in Sinatra, creating `get` routes
automatically creates `head` routes.

Choreographer has to [parse][] the URL to match the routes (obviously). For
convenience, the `.parsedUrl` property on the [http.ServerRequest][req] object
is set to the [parsed URL object][parsedURL] so you needn't re-parse the URL
(unless that property is already set to a parsed URL object, in which case,
Choreographer will just use that object).

[parse]: http://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost
[req]: http://nodejs.org/api/http.html#http_class_http_serverrequest
[parsedURL]: http://nodejs.org/api/url.html#url_url

Notice that `router` is just an event listener for the `request` event on
`http.createServer`, so if you want a listener that does more than routing:

    http.createServer(function(req, res) {
      //do middleware stuff before routing
      router.apply(this, arguments);
      //do more stuff
    }).listen(80);

Understanding The Code
----------------------

The code is just as simple: first half is the router, second half is the
routes. Lightweight and easy to understand.

The entire architecture is designed around the philosophy of being so simple
it obviously has no bugs, rather than so complicated it has no obvious bugs.

Open-Source License
-------------------

[GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)
