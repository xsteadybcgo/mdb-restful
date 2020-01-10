const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false } // select 在查询时不再显示
})

module.exports = model('User', userSchema)


