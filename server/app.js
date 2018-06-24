const Koa = require('Koa')
const koaBody = require('koa-body');
const app = new Koa()
const doLogin = require('./doLogin')
const { getUserId } = require('./token')

app.use(koaBody())
app.use(doLogin)

app.use(async (ctx, next) => {


  var accesstoken = ctx.header.accesstoken
  if (ctx.url === '/login') {

    ctx.body = ctx.state.user

  } else if(ctx.url === '/go'){
    var accesstoken = getUserId(accesstoken)
    console.log(accesstoken)
    ctx.body = accesstoken
  }
  next()
  // ctx.body = JSON.stringify(ctx.request.body);
});


app.listen(3000);
