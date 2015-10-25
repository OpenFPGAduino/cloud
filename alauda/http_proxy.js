var http = require('http');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer();

http.createServer(function(req, res) {
	//todo load balance
	proxy.web(req, res, { target: 'http://localhost:8888' });
}).listen(80);

proxy.on('error', function(e) {
    //todo HA
});
