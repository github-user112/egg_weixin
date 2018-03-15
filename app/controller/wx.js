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
  async receive () {
    const {app, ctx} = this
    const {signature, timestamp, nonce, echostr} = ctx.request.query
    let req_xml = ctx.request.body.xml
    console.dir(req_xml)
    console.dir(ctx.app.cache)
    let res_xml = `<xml>
          <ToUserName><![CDATA[${req_xml.FromUserName}]]></ToUserName>
          <FromUserName><![CDATA[${req_xml.ToUserName}]]></FromUserName>
          <CreateTime>${req_xml.CreateTime}</CreateTime>
          `
    const result = await ctx.service.wxReceive.insert(req_xml)
    if (result.affectedRows === 1) { // 插入成功
      switch (req_xml.MsgType[0]) {
        case 'event':
          switch (req_xml.Event[0]) {
            case 'subscribe': // 用户关注
              res_xml += `<Content><![CDATA[感谢关注]]></Content> <MsgType><![CDATA[text]]></MsgType></xml>`
              break
            case 'unsubscribe':
              break
            case 'CLICK':

              res_xml += `<Content><![CDATA[2354]]></Content> <MsgType><![CDATA[text]]></MsgType></xml>`
              break
          }

          break
        case 'text':
          res_xml += `<Content><![CDATA[${req_xml.Content}]]></Content><MsgId>${req_xml.MsgId}</MsgId> <MsgType><![CDATA[${req_xml.MsgType}]]></MsgType></xml>`
          break
        case 'image':
          res_xml += `<Image><MediaId><![CDATA[${req_xml.MediaId}]]></MediaId></Image><MsgId>${req_xml.MsgId}</MsgId> <MsgType><![CDATA[${req_xml.MsgType}]]></MsgType></xml>`
          break
      }
      ctx.body = res_xml
    } else {
      ctx.body = 'success'
    }

  }
  async token () {
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

module.exports = WxController