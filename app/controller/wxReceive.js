'use strict'
const Controller = require('egg').Controller

class WxReceiveController extends Controller {
  async index () {
    const {app, ctx} = this
    let req_xml = ctx.request.body.xml
    let res_xml = `<xml>
          <ToUserName><![CDATA[${req_xml.FromUserName}]]></ToUserName>
          <FromUserName><![CDATA[${req_xml.ToUserName}]]></FromUserName>
          <CreateTime>${req_xml.CreateTime}</CreateTime>
          <MsgType><![CDATA[${req_xml.MsgType}]]></MsgType>
          <MsgId>${req_xml.MsgId}</MsgId>`
    const result = await ctx.service.wxReceive.insert(req_xml)
    if(result.affectedRows === 1){ // 插入成功
      switch (req_xml.MsgType[0]) {
        case 'text':
          ctx.body = res_xml + `<Content><![CDATA[${req_xml.Content}]]></Content></xml>`
          break
        case 'image':
          ctx.body = res_xml + `<Image><MediaId><![CDATA[${req_xml.MediaId}]]></MediaId></Image></xml>`
          break
      }
    }else{
      ctx.body = 'success'
    }

  }
}

module.exports = WxReceiveController