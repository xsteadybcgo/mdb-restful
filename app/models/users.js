const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const userSchema = new Schema({
    __v: { type: Number, select: false },
    password: { type: String, required: true, select: false }, // select 在查询时不再显示
    avatar_url: { type: String },
    name: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], default: 'male', required: true }, // ?? enum
    headline: { type: String, default: "你是最棒的" },
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }], select: false },
    business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
    employments: {
        type: [{
            company: { type: Schema.Types.ObjectId, ref: 'Topic' },
            job: { type: Schema.Types.ObjectId, ref: 'Topic' },

        }],
        select: false
    },
    educations: {
        type: [{
            school: { type: Schema.Types.ObjectId, ref: 'Topic' },
            major: { type: Schema.Types.ObjectId, ref: 'Topic' },
            diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }
        }],
        select: false
    },
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        select: false
    },
    followingTopics: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
        select: false
    }
})

module.exports = model('User', userSchema)


