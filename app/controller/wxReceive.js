'use strict'

const Controller = require('egg').Controller

class WxReceiveController extends Controller {
  async index () {
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
}

module.exports = WxReceiveController