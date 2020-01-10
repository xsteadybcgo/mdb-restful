class Home {
    index(ctx) {
        a
        ctx.body = "主页"
    }
    upload(ctx) {
        const file = ctx.request.files.file
    }
}

module.exports = new Home()