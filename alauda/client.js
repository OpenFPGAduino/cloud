var net = require('net');
var host = 'localhost';//填入机器B的IP或者域名，这里测试填的是本地域名
var port = 8000;//填入机器B的提供client连接的端口
var client;
var loc;

  client = net.connect(port,host, function() {
	console.log("代理服务端："+host+':'+port+' 连接成功！');
	loc = net.connect(8888, function() {
	  console.log('本地远程桌面 3389 连接成功！');
	  loc.pipe(client);
	  client.pipe(loc);
	});
	loc.on('close', function() {
	  delete(loc);
	  if(client)client.end();
	  console.log('local 8888 disconnected');
	});
  });
  client.on('error', function() {
	console.log("代理服务端："+host+':'+port+' 连接失败，正在重试...');
	setTimeout(connect,5000);
  });
  client.on('close', function() {
	delete(client);
	if(loc)loc.end();
	console.log(host+':'+port+' 代理连接已关闭');
	setTimeout(connect,100);
  });


