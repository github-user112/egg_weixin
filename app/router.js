'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/wx', controller.wx.index);
  router.post('/wx', controller.wx.receive);
  router.get('/wx_token', controller.wx.token);
  router.post('/upload', controller.upload.index);
};
