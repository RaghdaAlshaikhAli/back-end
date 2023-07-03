const fs = require("fs")
const CourseModel = require('../model/course.model');
const courseValidte = require('../validation/course.validate')

const getLogger = require('../services/logger')
const logger=getLogger("course")

const createCourse = async (req,res) => {
    try
    {
        const course = new CourseModel(req.body);
        if(req.file)
        {
            course.image = req.file.path
        }
        const {error} = courseValidte(req.body)
        if(error){
            return res.status(400).json({error:error.details[0].message})
        }
        const result = await course.save();
        res.status(201).json({
            status : 201,
            message : 'Course created successfully',
            data: result,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });
    }
}

const showCourses = async (req,res)=>{
    try
    {
        const courses = await CourseModel.find({}).populate('enroll');
        res.status(200).json({
            status : 200,
            data: courses,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

const showCourse = async (req,res)=>{
    try
    {
        const {id} = req.params
        const course = await CourseModel.findById(id).populate('enroll');
        if(!course){
            res.status(404).json({message:`can not find any course with ID : ${id}`})
            logger.error(`can not find any course with ID : ${id}`)
        }
        res.status(200).json({
            status : 200,
            data: course,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
}

const updateCourse = async (req,res)=>{
    try
    {
        const {id} = req.params
        const course = await CourseModel.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        });

        if(!course){
            logger.error(`can not find any course with ID : ${id}`)
            res.status(404).json({message:`can not find any course with ID : ${id}`})
        }
        if(req.file)
        {
            if(course.image != "uploads/courses/default.png")
            {
                fs.unlinkSync(`${course.image}`)
            }
        }
        res.status(200).json({
            status : 200,
            data: course,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
}

const deleteCourse = async (req,res)=>{
    try
    {
        const _id = req.params.id
        const course = await CourseModel.findByIdAndDelete(_id);
        if(!course){
            logger.error(error.message)
            res.status(404).json({message:`can not find any course with ID : ${id}`})
        }
        if(course.image != "uploads/courses/default.png")
        {
            fs.unlinkSync(`${course.image}`)
        }
        res.status(200).json({
            status : 200,
            data: course,
        });
    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}
const enroll = async (req,res) => {
    try
    {
        const userId = req.body.id

        const courseId = req.params.courseId

        const course = await CourseModel.findById(courseId);

        if(!course)
        {
            logger.error(error.message)
            return res.status(404).json({message:`can not find any course with ID : ${courseId}`})
        }

        if(!course.enroll.includes(userId))
        {
            course.enroll.push(userId);
        }
        else
        {
            logger.error(error.message)
            return res.status(422).json({message:`This user exists !!`})
        }
        
        await course.save()

        res.status(200).json({message : req.body})

    }
    catch(error)
    {
        logger.error(error.message)
        res.status(400).json({message : error.message})
    }

}

module.exports = {createCourse,showCourses,showCourse,updateCourse,deleteCourse,enroll};

