const LessonModel = require('../model/lesson.model.js');

const createLesson = async(req, res)=>{
    try{
        const lesson = new LessonModel(req.body)
        await lesson.save()
        res.status(200).send(lesson)
    }
    catch(e) 
    {
        res.status(400).send(e.message)
    }
}

const showlessons = async(req, res)=>{
    try{
        const lessons = await LessonModel.find({});
        res.status(200).send(lessons)
    }
    catch(e){
        res.status(400).send(e.message)
    }
}

const showlesson = async(req, res)=>{
    try{
        const lesson = await LessonModel.findById(req.params.id);
        if(!lesson) res.status(404).send("can't find lesson")
        res.status(200).send(lesson)
    }
    catch(e){
        res.status(400).send(e.message)
    }
}


const updateCourse = async (req, res)=>{
    try{
        const _id = req.params.id;
        const lesson = await LessonModel.findByIdAndUpdate({_id} , req.body , {
            new:true, 
            runValidators:true
        });
        if(!lesson) res.status(404).send("no lesson to update")
        await lesson.save()
        res.status(200).send(lesson)
    }
    catch(e){
        res.status(400).send(e.message)
    }
}


const deleteCourse = async (req, res)=>{
    try{
        const _id = req.params.id;
        const lesson = await LessonModel.findByIdAndDelete(_id)
        if(!lesson) res.status(404).send("no lesson to delete")
        res.status(200).send(lesson)
    }
    catch(e){
        res.status(400).send(e.message)
    }
}


module.exports = {createLesson, showlessons ,showlesson, updateCourse, deleteCourse}