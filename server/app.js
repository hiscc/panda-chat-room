const Koa = require('koa')
const koaBody = require('koa-body')
const koaqs = require('koa-qs')
const serve = require('koa-static');
const app = new Koa()
const router = require('./router/index')


koaqs(app)
app.use(koaBody({
  formidable:{uploadDir: './uploads'},
  multipart: true,
  urlencoded: true,
}))
app.use(serve(__dirname + '/'))
app.use(router.routes())


app.listen(3000, () => {
  console.log(`app is running on 3000`)
})
