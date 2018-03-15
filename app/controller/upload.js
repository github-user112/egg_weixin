const path = require('path');
const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;
const fs = require('fs')
const Controller = require('egg').Controller;

class UploaderController extends Controller {
  async index() {
    const stream = await this.ctx.getFileStream();
    const target = path.join(this.config.baseDir, 'upload_images', stream.filename);
    console.log(target)
      const writeStream = fs.createWriteStream(target);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }
    console.log(typeof  stream)
    this.ctx.body = {
      a:1,
      /*url: result.url,
      // 所有表单字段都能通过 `stream.fields` 获取到
      fields: stream.fields,*/
    };
  }
}

module.exports = UploaderController;