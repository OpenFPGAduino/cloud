/*
/*
 * Author: 
 *         Zhizhou Li <lzz@meteroi.com>
 *
 Copyright 2015 Meteroi
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
var http = require("http"),
        url  = require("url"),
        path = require("path"),
        fs   = require("fs"),
        querystring = require("querystring"),
        connect = require('connect');
        wechat = require('wechat');

var config = {
  token: 'openfpgaduino',
  appid: 'wxc61069fb23ba1314',
  encodingAESKey: '1gbKlesArQVc6fNaGBi15rx2QrzARHaiyS8nDpnYAuv'
};

var app = connect();
app.use(connect.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // message is located in req.weixin
  var message = req.weixin;
  if (message.FromUserName === 'diaosi') {
    // reply with text
    res.reply('hehe');
  } else if (message.FromUserName === 'text') {
    // another way to reply with text
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (message.Content === 'hehe') {
    // reply with music
    res.reply({
      type: "music",
      content: {
        title: "Just some music",
        description: "I have nothing to lose",
        musicUrl: "http://mp3.com/xx.mp3",
        hqMusicUrl: "http://mp3.com/xx.mp3"
      }
    });
  } else {
    // reply with thumbnails posts
    res.reply([
      {
        title: 'The openfpgaduino website',
        description: 'View the sourcecode of the openfpgaduino website',
        picurl: 'https://github.com/OpenFPGAduino/docs/blob/master/main.jpg',
        url: 'https://github.com/OpenFPGAduino/OpenFPGAduino'
      }
    ]);
  }
}));
http.createServer(app).listen(80);
