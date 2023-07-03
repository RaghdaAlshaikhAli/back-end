const mongoose = require('mongoose')
const validator = require ('validator')

const newsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        validate(val){if(validator.isEmpty(val)){ throw new Error ('title is required')}}
    },
    content:{
        type: String,
        required: true,
        trim: true,
        validate(va){if(validator.isEmpty(va)){ throw new Error ('content is required')}}
    },
    category:[{
        type: String,
        required : true,
        trim:true,
        validate(v){if(validator.isEmpty(v)){ throw new Error ('category is required')}}
    }],
    publishingDate:{
        type : String,
        required : true,
        trim : true
    },
    image:{
        type: String,
        trim : true,
        default:'uploads/news/default.png'
    }
});

const NewsModel = mongoose.model('news', newsSchema );

module.exports = NewsModel;
