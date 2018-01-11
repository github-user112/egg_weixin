// 定时获取微信 access_token
module.exports = {
  schedule: {
    interval: '7000s', // 1 分钟间隔
    type: 'all', // 指定所有的 worker 都需要执行
    immediate:true //立即执行
  },
  async task(ctx) {
    const res = await ctx.curl('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxec337fcddb956acd&secret=6713aeb6346da1320859bcdb1d40af29',{
      dataType: 'json',
    });
    const jsapi = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${res.data.access_token}&type=jsapi`,{
      dataType: 'json',
    });
    let count = 1
    if (count) {
      const result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${res.data.access_token}`, {
        // 必须指定 method
        method: 'POST',
        // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        contentType: 'json',
        data: {
          "button": [
            {
              "type": "click",
              "name": "今日歌曲",
              "key": "V1001_TODAY_MUSIC"
            },
            {
              "name": "菜单",
              "sub_button": [
                {
                  "type": "view",
                  "name": "搜索",
                  "url": "http://123.206.56.48/public/index.html"
                },
                {
                  "type": "click",
                  "name": "赞一下我们",
                  "key": "V1001_GOOD"
                }
              ]
            }
          ]
        },
        // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        dataType: 'json',
      });
      count = 0
    }
    ctx.app.cache = Object.assign({},jsapi.data,res.data);
  },
};