let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');

class Application {
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
  callback() {
    return (req, res) => {
      this.callbackFunc(req, res);
    }
  }
  createContext(req, res) {
    let ctx = Object.create(this.context);
    ctx.request = Object.create(this.request);
    ctx.response = Object.create(this.response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
}

module.exports = Application;