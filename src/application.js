let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
let EventEmitter = require('events');

class Application extends EventEmitter {
  constructor() {
    this.callbackFunc;
  }
  listen(port) {
    let server = http.createServer(this.callback());
    server.listen(port);
  }
  use(fn) {
    this.callbackFunc = fn;
  }
  createContext(req, res) {
    let ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
  compose() {
    return async ctx => {
      function createNext(middleware, oldNext) {
        return async () => {
          await middleware(ctx, oldNext);
        }
      }
      let len = this.middlewares.length;
      let next = async () => {
        return Promise.resolve();
      }
      for (let i = len - 1; i >= 0; i--) {
        let currentMiddleWare = this.middlewares[i];
        next = createNext(currentMiddleWare, next);
      }
      await next();
    }
  }
  callback() {
    return (req, res) => {
      let ctx = this.createContext(req, res);
      let respond = () => this.responseBody(ctx);
      let onerror = err => this.onerror(err, ctx);
      let fn = this.compose();
      return fn(ctx).then(respond).catch(onerror);
    }
  }
}

module.exports = Application;