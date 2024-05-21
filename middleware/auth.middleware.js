//create a middleware will check if the request body is proper and correct
const user_model= require("../models/user.model")
const jwt= require("jsonwebtoken")
const auth_config= require("../configs/auth.config")

const verifySignupBody =async(req,res,next)=>{
     try {
        //check for the name
           if(!req.body.name){
            return res.status(400).send({
                message:"Failed ! Name was not provide in request body"
            })
           }
        //check for the email
        if(!req.body.email){
            return res.status(400).send({
                message:"Failed ! email was not provide in request body"
            })
           }
         //check for the userId
         if(!req.body.userId){
            return res.status(400).send({
                message:"Failed ! userId was not provide in request body"
            })
           }
          //check if the user with the same userId is already present
           const user= await user_model.findOne({userId:req.body.userId})
           
           if(user){
            return res.status(400).send({
                message:"Failed ! user with same userId is already present"
            })
            
           }

           
           next()
     } catch (error) {
        console.log("Error while validting the request object",error);
        res.status(500).send({
            message:"Error while validating the request body"
        })
     }
     
}

const verifySigninBody=async(req,res,next)=>{
    if(!req.body.userId){
        return res.status(400).send({
            message:"UserId is not provided"
        })
    }
    if(!req.body.password){
        return res.status(400).send({
            message:"password is not provided"
            
        })
        
    }
   next()
}

const verifyToken= async(req,res,next)=>{
    //check if the token is present in the header
    const token= req.header('x-access-token')

    if(!token){
        return res.status(403).send({
            message:"No token found: UnAuthorized"
        })
    }
    //if its the valid token
      jwt.verify(token,auth_config.secret,async(err,decoded)=>{
        if(err){
            return res.status(401).send({
                message:"UnAuthorized"
            })
        }
        const user= await user_model.findOne({userId:decoded.id})
        if(!user){
            return res.status(400).send({
                message:"UnAuthorized,this user for this token doesn't exist"
            })
        }
        //set the user info in req body
        req.user=user
        next()
      })

    //then move to next 
    
}

const isAdmin=(req,res,next)=>{
    const user= req.user
    if(user && user.userType == "ADMIN"){
        next()
    }else{
        return res.status(403).send({
            message:"Only ADMIN uers are allowed to access this endpoint"
        })
    }
}



module.exports= {
    verifySignupBody:verifySignupBody,
    verifySigninBody:verifySigninBody,
    verifyToken:verifyToken,
    isAdmin:isAdmin
}