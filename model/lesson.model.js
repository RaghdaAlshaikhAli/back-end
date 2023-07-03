const mongoose = require('mongoose');
const validator = require('validator');


const lessonSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    url :{
        type:String,
        required:true,
        trim:true, 
        validate: { 
            validator: value => validator.isURL(value, { protocols: ['http','https','ftp'], require_tld: true, require_protocol: true }),
            message: 'Must be a Valid URL' 
        }
    },
    completed:{
        type:Boolean,
        default:false
    }
});

const LessonModel = mongoose.model('lessons' , lessonSchema)

module.exports = LessonModel