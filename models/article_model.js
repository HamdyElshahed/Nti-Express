const mongoose = require('mongoose');

const articleSc = mongoose.Schema({
    title:{
       type: String,
       require: true,
    },
    content: {
        type: String,
        require: true,
    },
    publisher: {
        id: {type:String, require:true},
        name: {type:String, require:true},
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Article = mongoose.model('articles', articleSc)

module.exports = {Article}