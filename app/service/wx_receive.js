const Service = require('egg').Service;
class wx_receiveService extends Service {
  async insert(req_xml) {
    const {app, ctx} = this
    const result = await app.mysql.insert('user_messages', {
      id: req_xml.MsgId[0],
      message: req_xml.Content ? (req_xml.Content[0]) : (req_xml.MediaId[0]),
      from_user_name: req_xml.ToUserName[0],
      update_time: new Date(),
    })
    return result;
  }
}
module.exports = wx_receiveService;