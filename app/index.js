const Koa = require('koa');
const koaBody = require('koa-body')
const jsonError = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const path = ('path')
const routing = require('./routes')
const { connectionStr } = require('../config')

const app = new Koa();

// 连接数据库
mongoose.connect(connectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("mongoodb connected success!!!")
})
mongoose.connection.on('error', console.error)

app.use(jsonError({
    postFormat: (err, { stack, ...rest }) => process.env.NODE_EVN === 'production' ? rest : { stack, ...rest }
}))
app.use(parameter(app))
app.use(koaBody({
    multipart: true, // 启用文件格式
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true
    }
}))
routing(app)


app.listen(3000, () => console.log("程序启动"))