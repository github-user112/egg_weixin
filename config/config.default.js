'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.security={
    csrf:{
      enable: false,
      ignore:'/wx',
    },
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515146088489_1909';

  config.bodyParser = {
    enable:false,
  }

  // add your config here
  config.middleware = ['xmlParse','bodyParse'];

  config.mysql = {
    client: {
      // host
      host: '123.206.56.48',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '2d996368',
      // 数据库名
      database: 'weixin',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  }

  return config;
};
