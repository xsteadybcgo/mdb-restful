const mongoose = require('mongoose')
const User = require('./users')
const Topic = require('./topics')

const { Schema, model } = mongoose;

const questionSchema = new Schema({
    __v: { type: Number, select: false },
    title: { type: String, required: true },
    description: { type: String },
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    // 一个问题下的话题类型是有限的，在设计多对多关系时，将问题模型新增话题字段较为合理
    topics: {
        type: [{
            type: Schema.Types.ObjectId, ref: 'Topic',
            select: false
        }]
    }
})

module.exports = model('Question', questionSchema)