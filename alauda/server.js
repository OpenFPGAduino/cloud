/*
反向代理远程桌面的服务端代码
author:yoyo@play175.com
*/
var client_port = 8000;//填入供反向客户端client连接的端口
var loc_port = 8080;//填入服务端对外提供的远程桌面端口，远程桌面客户端需要连接到此端口

//以下为命令行支持
var arguments = require('./argvparser');
arguments.parse([
     {'name': /^(-clientport)$/, 'expected': /\d+/, 'callback': setclientport}
     ,{'name': /^(-rdpport)$/, 'expected': /\d+/, 'callback': setrdpport}
  ], main, null);

function setclientport(end,val){
  client_port = parseInt(val);
  end();
}
function setrdpport(end,val){
  loc_port = parseInt(val);
  end();
}

//主程序入口
function main() {
	var net = require('net');
	var client = null;//远程连接
	net.createServer(function(c) {//供反向客户端连接
	  client = c;
	  console.log('connection '+c.remoteAddress+':'+c.remotePort+' connected \n已连通，现在可以远程桌面连接到本机的'+loc_port+'端口了！');
	  c.on('close', function() {
		console.log('connection '+c.remoteAddress+':'+c.remotePort+' disconnected\n等待客户端连接中...');
		delete(client);
	  });
	}).listen(client_port, function() {
	  console.log('代理服务端已开启： '+client_port);
	});

	net.createServer(function(c) {//供代理远程桌面连接
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
	  console.log('本机远程桌面端口已开启：'+loc_port +'\n等待客户端连接中...');
	});
	process.title = '服务端';
	return;
}
