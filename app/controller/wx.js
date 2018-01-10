'use strict'
const crypto = require('crypto');
const Controller = require('egg').Controller

class WxController extends Controller {
  async index () {
    const {app, ctx} = this
    const {signature, timestamp, nonce, echostr} = ctx.request.query
    const token = 'weixin'
    if (signature&&timestamp&&nonce&&echostr) { // 微信的请求
      let ori_array = [nonce,token,timestamp]
      let ori_str = ori_array.sort().join('')
      let sha1Code = crypto.createHash("sha1");
      let code = sha1Code.update(ori_str,'utf-8').digest("hex");
      if(code === signature){
         ctx.body = echostr
      }
    }
  }
}

module.exports = WxController