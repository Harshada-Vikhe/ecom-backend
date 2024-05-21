// neeed to write controller/logic to register a user
const bcrypt= require("bcryptjs")
const user_model= require("../models/user.model")
const jwt = require("jsonwebtoken");
const secret= require("../configs/auth.config")

exports.signup= async(req,res)=>{
    //logic to create user

    //1/read the req body
      const {name,userId,email,userType,password}= req.body

    //2. insert data in user collection in mongodb
    
    const userObj = {
        name:name,
        userId:userId,
        email:email,
        userType:userType,
        password: bcrypt.hashSync(password,8)
     }

     try {
       const user_created= await user_model.create(userObj)
       //return this user
       //201 indicted something created succesfully
       const res_obj={
         name:user_created.name,
         userId:user_created.userId,
         email:user_created.email,
         userType:user_created.userType,
         createdAt:user_created.createdAt,
         updatedAt:user_created.updatedAt
       }
       res.status(201).send(res_obj)

     } catch (error) {
        console.log("Error while registering the user",error);
      //500 inernal server error
        res.status(500).send({
            message:"some error happened while registering user."
        })
    }

    //3 return response back to user
}

exports.signin=async(req,res)=>{

  //check if the user id is present in the system
  const user= await user_model.findOne({userId:req.body.userId})
  if(user == null){
   return res.status(400).send({
      message:"User id passed is not a valid user id"
    })
  }
  //pass is correct
  const isPasswordValid= bcrypt.compareSync(req.body.password,user.password)
  if(!isPasswordValid){
   return res.status(401).send({
      message:"Wrong password passed"
    })
  }
  //using JWT we wil create the access token with a given TTL(time to live) and return
   const token = jwt.sign({id:user.userId},secret.secret,{
    expiresIn:120
   })

   res.status(200).send({
    name:user.name,
    userId:user.userId,
    email:user.email,
    userType:user.userType,
    accessToken:token
   })
}