const mongoose = require ('mongoose')
const validator = require ('validator')
const bcryptjs = require ('bcryptjs')
const jwt = require ('jsonwebtoken')
const Schema=mongoose.Schema

const userSchema = new mongoose.Schema ( {
    username : {
        type: String,
        
        trim : true
    },
    password : {
        type: String,
        
        trim: true,
        minlength: 8,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!password.test(value)){
                throw new Error("Password must include uppercase , lowercase , numbers , speacial characters")
            }
        }

    },
    email : {
        type: String,
        
        trim: true,
        lowercase : true,
        unique: true,
        validate(val){
            if(!validator.isEmail(val)){
                throw new Error ('Email is INVALID')
            }
        }
    },
    age : {
        type: Number,
        default: 18,
        validate(val){
            if (val <= 0){
                throw new Error ('age must be a positive number')
            }
        }
    },
    certificate_file:{type:String, default:"/course/image/ .png"},
    course_id:{type: Schema.Types.ObjectId, ref:"course" ,required:true},
    enrolled: [{
        name:{type:String,trim:true,required:true},
        phone:{type:String,trim:true,required:true},
        level:{type:String,trim:true,required:true},
      }],
  


    city: {
        type:String
    },
    
    tokens : [
        {
            type: String,
            required : true
        }
    ],
})


// virtual relations 

  userSchema.virtual ('tasks' , {
     ref: 'Task',
     localField : "_id",
     foreignField :"owner"
  }) 


////////////////////////////////////////////////////////////////////////////////////////
userSchema.pre ("save" , async function ()  {
       const user = this   //  => Document 

       if (user.isModified('password')) {
        user.password = await bcryptjs.hash(user.password, 10)
       }
})
//////////////////////////////////////////////////////////////////////////////////////////
// Login 

userSchema.statics.findByCredentials = async (em,pass) =>{
  
    const user = await User.findOne({email:em})
    if(!user){
        throw new Error('Unable to login')
    }
   
    const isMatch = await bcryptjs.compare(pass,user.password)
  
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

//////////////////////////////////////////////////////////////////////////////////////////
const users={
    signup:async (req,res)=>{
        try {

            let {name,password,phone,email}=req.body
            let {errors,isValid}= validateSignupData(name,email,password,phone)
            let uniqueEmail=await User.findOne({email})
            if(uniqueEmail) return res.status(403).send({email:"Email address already taken"})

            if(!isValid) return res.status(403).send(errors)

            const user=new User(req.body)
            await user.save()
            .catch((err)=>{
                console.log(err.message);
              //  if(Object.keys(err.keyValue)[0]=='phone')return res.status(403).send({phone:"Phone number is already taken"})
                 if(Object.keys(err.keyValue)[0]=='email')return res.status(403).send({email:"Email address is already taken"})
            })
            res.sendStatus(201)
        } catch (error) {
            console.log(error.message);
            res.status(400).send(error.message)
        }
    },
    signin:async(req,res)=>{
        try {
            let {email,password}=req.body
            let user=await User.findOne({ email })
            if(!user) return res.status(404).send({phone:"Email address not found"})
            if(!await bcrypt.compare(password,user.password)) return res.status(403).send({password:"Invalid Password"})
            const token = await middleware.generateToken({user})
            res.send({token})
        } catch (error) {
            console.log(error.message);
            res.status(500).send({error:error.message})
        }
    },
    addNews: async()=>{
        try {
            
        } catch (error) {
            console.log(error.message);
            res.status(500).send({error:error.message})
        }
    },
    postCv:async ()=>{
        try {
            let id =req.user._id
            let tempCv=await CSSMathValue.findOne({user_id:id})
            if(tempCv){
                await CSSMathValue.findByIdAndUpdate(tempCv._id,req.body)
                .then(()=>res.send())
                .catch((err)=>res.status(400).send({message:err.message}))
            }else{
                let cv = new Cv(req.body)
                cv.save()
                .then(()=>res.send())
                .catch((err)=>res.status(400).send({message:err.message}))
            }
        } catch (error) {
            
        }
    }
}

/////////////////////////////////////////////////
  userSchema.methods.generateToken = async function () {
     const user = this 
     const token = jwt.sign ({_id:user._id.toString() } , "islam500")
     user.tokens = user.tokens.concat(token)
     await user.save()
     return token
  }

//////////////////////////////////////////////////////////////////////////////////////////
//  hide private data 

  userSchema.methods.toJSON = function (){
      const user = this 

       
      const userObject = user.toObject()

      delete userObject.password
      delete userObject.tokens

      return userObject 
  }

  //////////////////////////////////////////////////////////////////////
const User = mongoose.model( 'User' , userSchema  )


module.exports = User