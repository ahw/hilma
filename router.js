const { URL } = require('url');

class Router {
    constructor(server) {
        this.server = server;
        this.listening = false;
        this.host = null;
        this.port = null;
        this.requestHandlers = {};
    }

    handleRequest(request, response) {
        const url = new URL(request.url, `http://${this.host}:${this.port}`);
        const path = url.pathname;
        const method = request.method.toUpperCase();

        if (this.requestHandlers[method] && this.requestHandlers[method][path]) {
            console.log(`Invoking ${method} ${path} handler`);
            this.requestHandlers[method][path](request, response);
        } else {
            response.writeHeader(404);
            response.end(`No handler found for ${method} ${path}`);
        }
    }

    addHandler(method, path, fn) {
        if (typeof this.requestHandlers[method] === 'undefined') {
            this.requestHandlers[method] = {};
        }

        this.requestHandlers[method][path] = function(request, response) {
            return fn(request, response);
        }
    }

    get(path, fn) {
        this.addHandler('GET', path, fn);
    }

    post(path, fn) {
        this.addHandler('POST', path, fn);
    }

    listen(port, host) {
        this.listening = true;
        this.host = host;
        this.port = port;
        console.log(`Listening on http://${host}:${port}`);
        this.server.on('request', this.handleRequest.bind(this));
        this.server.listen(port, host);
    }
}

module.exports = Router;
