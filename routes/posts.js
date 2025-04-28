const mongoose = require('mongoose')
const postSchema = mongoose.Schema({
    images: String,
    PosText: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
})

module.exports = mongoose.model('post', postSchema)