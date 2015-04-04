// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var qiniu = require("qiniu");

var upload = false;
var download = false;
var arguments = process.argv.splice(2);
for (index in arguments)
{
	if (arguments[index]=="-upload") upload=true;
        else if (arguments[index]=="-download") download = true;
}

// file upload 
qiniu.conf.ACCESS_KEY = 'IrDtWu7b7mBVDqSjLcek1kfbb3CM90JblgImlko6';
qiniu.conf.SECRET_KEY = '1UlARj0pqeAiL_ipBLke1Gm_HBGNL60KDrSDjUdX';

var bucketname = 'openfpgaduino';
var cloudname = 'http://7xi3cc.com1.z0.glb.clouddn.com/';
var gzfilename = 'grid.tar.gz';

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

function rmFile(bucketName, key) {
var client = new qiniu.rs.Client();
client.remove(bucketName, key, function(err, ret) {
  if (!err) {
    // ok
    console.log(ret); 
  } else {
    console.log(err);
    // http://developer.qiniu.com/docs/v6/api/reference/codes.html
  }
})
}

function lsFile(bucketName, key) {
var client = new qiniu.rs.Client();
client.stat(bucketName, key, function(err, ret) {
  if (!err) {
    // ok 
    // ret has keys (hash, fsize, putTime, mimeType)
    console.log(ret); 
  } else {
    console.log(err);
    // http://developer.qiniu.com/docs/v6/api/reference/codes.html
  }
});
}


function lsBucket(bucketname) {
var prefix = null;
var marker = null;
var limit = 100;
qiniu.rsf.listPrefix(bucketname, prefix, marker, limit, function(err, ret) {
  if (!err) {
    // process ret.marker & ret.it    
    console.log(ret);
  } else {
    console.log(err)
    // http://developer.qiniu.com/docs/v6/api/reference/rs/list.html
  }
});
}

if (upload == true) {
	lsFile(bucketname, "filelist.txt");
	lsBucket(bucketname);
	//rmFile(bucketname, "list.txt");
	//uploadBuf("grid.v", "list.txt", uptoken(bucketname));
	uploadFile("../../fpga/package/grid.tar.gz", "grid.tar.gz", uptoken(bucketname));
	uploadFile("../../fpga/package/grid.tar.gz", "smart.log", uptoken(bucketname));
}

// http file download
// App variables
var file_url = 'http://7xi3cc.com1.z0.glb.clouddn.com/grid.v';
var DOWNLOAD_DIR = '../../fpga/package/';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
if (download == true) {
	var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
	var child = exec(mkdir, function(err, stdout, stderr) {
	    if (err) throw err;
	    else download_file_httpget(file_url);
	});
}

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


// docker http trigger
var https = require('https');
var dockername = 'registry.hub.docker.com'; 
var dockerpath = '/u/lizhizhou/cloudfpga/trigger/';
var token = 'c0a34362-5a62-4d9a-921d-ed3ce9724f6f';
var postData = 'build=true';

var options = {
  hostname: dockername,
  port: 443,
  path: dockerpath + token +'/',
  method: 'POST'
};

function dock_build() {
	var req = https.request(options, function(res) {
	  console.log("statusCode: ", res.statusCode);
	  console.log("headers: ", res.headers);
	  res.on('data', function(d) {
	    process.stdout.write(d);
	  });
	});
	req.write(postData);
	req.end();
}

//dock_build();