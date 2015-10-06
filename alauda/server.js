var client_port = 8000;//填入供反向客户端client连接的端口
var loc_port = 8080;//填入服务端对外提供的端口

var debug = true;

function debuginf(string) {
	if (debug == true) {
		console.log(string);
	}
}

var net = require('net');
var client = null;
net.createServer(function(c) {
  client = c;
  debuginf('connection '+c.remoteAddress+':'+c.remotePort+' connected \n loc_port'+loc_port);
  c.on('close', function() {
	console.log('connection '+c.remoteAddress+':'+c.remotePort+' disconnected\n');
	delete(client);
  });
}).listen(client_port, function() {
  console.log('server port on： '+client_port);
});

net.createServer(function(c) {
  if(!client) {
	c.end();
	return;
  }
  c.pipe(client);
  client.pipe(c);
  c.on('close', function() {
	if(client)client.end();
  });
}).listen(loc_port, function() {
  console.log('client port on：'+loc_port +'\n');
});

