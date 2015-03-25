var qiniu = require("qiniu");

qiniu.conf.ACCESS_KEY = 'IrDtWu7b7mBVDqSjLcek1kfbb3CM90JblgImlko6'
qiniu.conf.SECRET_KEY = '1UlARj0pqeAiL_ipBLke1Gm_HBGNL60KDrSDjUdX'

function uptoken(bucketname) {
  var putPolicy = new qiniu.rs.PutPolicy(bucketname);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;

  return putPolicy.token();
}

function uploadBuf(body, key, uptoken) {
  var extra = new qiniu.io.PutExtra();
  //extra.params = params;
  //extra.mimeType = mimeType;
  //extra.crc32 = crc32;
  //extra.checkCrc = checkCrc;

  qiniu.io.put(uptoken, key, body, extra, function(err, ret) {
    if (!err) {
      // 上传成功， 处理返回值
      console.log(ret.key, ret.hash);
      // ret.key & ret.hash
    } else {
      // 上传失败， 处理返回代码
      console.log(err)
      // http://developer.qiniu.com/docs/v6/api/reference/codes.html
    }
  });
}

function uploadFile(localFile, key, uptoken) {
  var extra = new qiniu.io.PutExtra();
  //extra.params = params;
  //extra.mimeType = mimeType;
  //extra.crc32 = crc32;
  //extra.checkCrc = checkCrc;

  qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
    if(!err) {
      // 上传成功， 处理返回值
      console.log(ret.key, ret.hash);
      // ret.key & ret.hash
    } else {
      // 上传失败， 处理返回代码
      console.log(err);
      // http://developer.qiniu.com/docs/v6/api/reference/codes.html
    }
  });
}

uploadBuf("lizhizhou test", "li.txt", uptoken("openfpgaduino"));
uploadFile("../../fpga/package/grid.tar.gz", "grid.tar.gz", uptoken("openfpgaduino"));

// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

// App variables
var file_url = 'http://7xi3cc.com1.z0.glb.clouddn.com/grid.tar.gz';
var DOWNLOAD_DIR = './downloads/';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
var child = exec(mkdir, function(err, stdout, stderr) {
    if (err) throw err;
    else download_file_httpget(file_url);
});

// Function to download file using HTTP.get
var download_file_httpget = function(file_url) {
var options = {
    host: url.parse(file_url).host,
    port: 80,
    path: url.parse(file_url).pathname
};

var file_name = url.parse(file_url).pathname.split('/').pop();
var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

http.get(options, function(res) {
    res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
        });
    });
};
/*
var http = require('http');
var equal = require('assert').equal;
 
var username = 'falcon';
var password = '';
var _auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64')
 
var options = {
    host: 'localhost',
    port: 13080,
    path: '/SM/7/rest/1.1/incident_list/',
    method: 'GET',
    headers:{
        'accept': '*/*',
        'content-type': "application/atom+xml",
        'accept-encoding': 'gzip, deflate',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': _auth,
        'user-agent': 'nodejs rest client'
    }
};
 
var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    equal(200, res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
 
    res.on('data',function (chunk) {
         console.log('BODY: ' + chunk);
    });
});
 
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
 
 
req.end();
*/
/*
$ curl --data "build=true" -X POST https://registry.hub.docker.com/u/lizhizhou/cloudfpga/trigger/4dd21468-2d62-40e7-8ff3-98db4fc22a9a/
*/