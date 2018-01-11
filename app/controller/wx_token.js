'use strict'
const crypto = require('crypto');
const Controller = require('egg').Controller

class WxTokenController extends Controller {
  async index () {
    const {app, ctx} = this
    // console.dir('pathhhhhhhhhhhhhh'+ctx.href)
    if (ctx.host === '123.206.56.48') {
      // console.dir(ctx.app.cache)
      let url = ctx.query.url
      let timestamp = parseInt(new Date().getTime() / 1000) + ''
      let nonceStr = Math.random().toString(36).substr(2, 15)
      const {ticket} = ctx.app.cache // = Object.assign({},{signature, timestamp, nonce, echostr},ctx.app.cache)
      let ret = {
        jsapi_ticket: ticket,
        nonceStr: nonceStr,
        timestamp: timestamp,
        url: url
      }
      var ori_str = raw(ret);
      let sha1Code = crypto.createHash("sha1");
      let signature = sha1Code.update(ori_str,'utf-8').digest("hex");

      ctx.body = {timestamp,nonceStr,signature}
    }else{
      ctx.body = 'Error'
    }
  }
}

module.exports = WxTokenController

var raw = function (args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};