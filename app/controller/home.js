'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    /*this.ctx.body = '<h1>李亚东，好帅！！！！！！！！！！！</h1>';*/
    await this.ctx.render('home.nj', {a:1});
  }
}

module.exports = HomeController;
