const fs = require('fs')

module.exports = function (app) {
    fs.readdirSync(__dirname).forEach(file => {
        if (file === 'index.js') return
        const router = require(`./${file}`)
        app.use(router.routes())
        app.use(router.allowedMethods())
    })
}