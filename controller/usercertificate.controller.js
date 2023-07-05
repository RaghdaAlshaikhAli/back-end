const taskSchema = require("../model/taskCertificate.model");
const userSchema = require("../model/userCertificate.model");
const certificateAuth = require('../services/authCertificate.service');

const postUser = async (req, res) => {
    certificateAuth(req, res, async () => {
      const newNote= new Note({
        title :req.body.title,
        content : req.body.content
    })
    newNote.save()
    res.redirect('/users')
    console.log(req.body)

    const user = new userSchema (req.body)

    user.save()
    .then ((user) => {res.status(200).send(user)})
    .catch((e)=>{ res.status(400).send(e)})
    });
  };
  
  //get all users
  const getUsers = async(req,res)=>{
    certificateAuth(req, res, async () => {
      User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send(e)
    })
});
  }
  
  // to get by id 
  const getUserBYID = async(req,res)=>{
    certificateAuth(req, res, async () => {

      console.log(req.params)
      const _id = req.params.id
      User.findById(_id).then((user)=>{
          if(!user){
             return res.status(404).send('Unable to find user')
          }
          res.status(200).send(user)
      }).catch((e)=>{
          res.status(500).send(e)
      })
});
  }
  
  // // patch 
  const patchUser = async(req,res)=>{
    certificateAuth(req, res, async () => {
      try{

        const updates = Object.keys (req.body)
        // console.log(updates)

        const _id = req.params.id


        const user = await userSchema.findById (_id)
        if(!user){
            return res.status(404).send('No user is found')
        }

        updates.forEach((ele) => (user[ele] = req.body[ele]))

       await user.save()


         res.status(200).send(user)
   }
    catch(error){
        res.status(400).send(error)
    }

});
  }
  
  const deleteUser = async(req,res)=>{
    certificateAuth(req, res, async () => {
      try{
        const _id = req.params.id
        const user = await userSchema.findByIdAndDelete(_id)
        if(!user){
           return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
});
  }

  // login : 
  const login = async(req,res)=>{
    certificateAuth(req, res, async () => {
      try{
        const user = await userSchema.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.status(200).send({ user , token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
});
  }

  const token = async(req,res)=>{
    certificateAuth(req, res, async () => {
      try {
        const user = new userSchema (req.body)
        const token = await user.generateToken()
        await user.save()
         res.status(200).send({user , token})
    } catch (e) {
        res.status(400).send(e)
    }
});
  }

  const profile = async(req,res)=>{
    certificateAuth(req, res, async () => {
      res.status(200).send(req.user)

});
  }

  //logout :
  const logout = async(req,res)=>{
    certificateAuth(req, res, async () => {
      try{
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
});
  }


// logoutall :
  const logoutall = async(req,res)=>{
    certificateAuth(req, res, async () => {
      try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
});}

  module.exports = {
    postUser,
    getUsers,
    getUserBYID,
    patchUser,
    deleteUser,
    logoutall,
    logout,
    login,
    token,
    profile
  };