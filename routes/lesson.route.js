const {createLesson,showlessons,showlesson,updateCourse,deleteCourse} = require('../controller/lesson.controller')
const express = require('express');
const router = express.Router()

//create lesson
router.post('/createLesson' ,auth,  createLesson )
//get lessons
router.get('/showlessons' ,  showlessons )
//get single lesson
router.get('/lesson/:id' , auth, showlesson )
// update
router.patch('/lesson/:id' , auth, updateCourse)
// delete
router.delete('/lesson/:id' , auth, deleteCourse )
module.exports = router