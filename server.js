const http = require('http');
const url = require('url');
const fs = require('fs');
const Router = require('./router');

const server = http.createServer();
const router = new Router(server);

router.get('/hello', function(request, response) {
    response.writeHead(200, { 'Content-type': 'text/html' });
    response.end('<html><strong>yay</strong></html>');
});

router.get('/', function(request, response) {
    const index = fs.readFile('./index.html', function(error, data) {
        response.writeHead(200, { 'Content-type': 'text/html' });
        response.end(data.toString('utf8'));
    });
});

router.listen(3031, 'localhost');
