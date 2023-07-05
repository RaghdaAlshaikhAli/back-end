const mongoose =require('mongoose')
const Task = mongoose.model('Task' ,{
    title:{
        type:String,
        required:true,
        trim :true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User' //model
    }
})
module.exports =Task
//////////////////////////////////////////////////////////////////////