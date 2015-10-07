/*
反向代理远程桌面的客户端代码
author:yoyo@play175.com
*/

//以下代码用于维持进程，当子进程退出时，5秒后自动重新开启进程。作者:yoyo，http://yoyo.play175.com
if(process.argv.length>1) {//这个if肯定会成立，其作用是为了把内部的变量的作用范围和外部分离开来，避免冲突
  var newArgv = [];//
  var ifChild = false;
  process.argv.forEach(function (val, index, array) {
    if(val=='-run_in_child') {
      ifChild = true;
    }
    else if(index>0)newArgv.push(val);//第0个元素是命令/程序路径
  });
  if(!ifChild) {
    newArgv.push('-run_in_child');//子进程需要一个命令标志：run_in_child
    start();
    function start()
    {
      //console.dir(newArgv);
      console.log('master process is running.');
      var cp = require('child_process').spawn(process.argv[0], newArgv);
      cp.stdout.pipe(process.stdout);
      cp.stderr.pipe(process.stderr);
      cp.on('exit', function (code)
      {
        //可以在此添加进程意外退出的处理逻辑
        delete(cp);
        console.log('child process exited with code ' + code);
        setTimeout(start,5000);
      });
    }
    return;
  }
}
//维持进程代码结束

var net = require('net');
var host = 'localhost';//填入机器B的IP或者域名，这里测试填的是本地域名
var port = 8000;//填入机器B的提供client连接的端口
var client;
var loc;

//以下为命令行支持
var arguments = require('./argvparser');
arguments.parse([
     {'name': /^(-h|-host)$/, 'expected': /.+/, 'callback': setHost}
     ,{'name': /^(-p|-port)$/, 'expected': /\d+/, 'callback': setPort}
  ], main, null);

function setHost(end,val){
  host = val;
  end();
}
function setPort(end,val){
  port = parseInt(val);
  end();
}
//主程序入口
function main() {
	function connect() {
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
	}
	connect();
	process.title = '客户端';
	return;
}
