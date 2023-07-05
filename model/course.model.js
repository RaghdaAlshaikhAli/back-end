const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true
    },
    });
const UserModel = mongoose.model('users',userSchema);

const courseSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true,
    },
    instructor:{
        type : String,
        required : true,
        trim : true
    },
    level:{
        type : Number,
        required : true,
        trim : true
    },
    language:{
        type : String,
        required : true,
        trim : true
    },
    startDate:{
        type : String,
        required : true,
        trim : true
    },
    duration:{
        type : Number,
        required : true,
        trim : true
    },
    certificate:{
        type : Boolean,
        default : false
    },
    intro:{
        type : String,
        required : true,
        trim : true
    },
    assessment:{
        type : String,
        required : true,
        trim : true
    },
    requirements:{
        type : String,
        required : true,
        trim : true
    },
    materials:{
        type : String,
        required : true,
        trim : true
    },
    publishDate:{
        type : String,
        required : true,
        trim : true,
    },
    image:{
        type : String,
        trim : true,
        default:'uploads/courses/default.png'
    },
    enroll:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
});

const CourseModel = mongoose.model('courses',courseSchema);

module.exports = CourseModel;











































