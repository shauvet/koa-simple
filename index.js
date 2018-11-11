let Koa = require('./koa/application');
let app = new Koa();

app.use((req, res) => {
  res.writeHead(200);
  res.end('hello world');
});

app.listen(3000, () => {
  console.log('listen on 3000');
});