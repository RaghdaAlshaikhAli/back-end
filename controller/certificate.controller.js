const taskSchema = require("../model/taskCertificate.model");
const userSchema = require("../model/userCertificate.model");
const certificateAuth = require('../services/authCertificate.service');

const postTask = async (req, res) => {
    certificateAuth(req, res, async () => {
      try {
        const task = new taskSchema({ ...req.body, owner: req.user._id });
        await task.save();
        res.status(200).send(task);
      } catch (e) {
        res.status(400).send(e.message);
      }
    });
  };
  
  const getTasks = async(req,res)=>{
    certificateAuth(req, res, async () => {
    try{
      // const tasks = await taskSchema.find({})
      // res.status(200).send(tasks)
      await req.user.populate('tasks')
      res.status(200).send(req.user.tasks)
  }
  catch(e){
      res.status(500).send(e.message)
  }
});
  }
  
  const getTaskBYID = async(req,res)=>{
    certificateAuth(req, res, async () => {

    try{
      // const task = await Task.findById(req.params.id)
      const _id = req.params.id
      const task = await taskSchema.findOne({_id , owner : req.user._id})
      if(!task){
        return  res.status(404).send('يسطا التاسك دا مش بتاعك ')
      }
      await task.populate('owner')
      res.send(task)
  }
  catch(e){
      res.status(500).send(e.message)
  }
});
  }
  
  const patchTask = async(req,res)=>{
    certificateAuth(req, res, async () => {
    try{
      const _id = req.params.id
      const task = await taskSchema.findOneAndUpdate({_id , owner : req.user._id},req.body,{
          new:true,
          runvalidators:true
      })
      if(!task){
          return res.status(404).send('No task')
      }
      res.status(200).send(task)
  }
  catch(e){
      res.status(500).send(e.message)
  }
});
  }
  
  const deleteTask = async(req,res)=>{
    certificateAuth(req, res, async () => {
    try{
      const _id= req.params.id
      const task = await taskSchema.findOneAndDelete({_id , owner : req.user._id})
      if(!task){
          res.status(404).send('No task is found')
      }
      res.status(200).send(task)
  }
  catch(e){
      res.status(500).send(e.message)
  }
});
  }

  module.exports = {
    postTask,
    getTasks,
    getTaskBYID,
    patchTask,
    deleteTask
  };