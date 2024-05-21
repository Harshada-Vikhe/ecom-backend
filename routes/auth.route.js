//POST: localhost:8080/ecom/api/v1/auth/signup
//i need to accept this

const autController= require("../controllers/auth.controller")
const authMiddleware= require("../middleware/auth.middleware")


module.exports=(app)=>{
    app.post("/ecom/api/v1/auth/signup",[authMiddleware.verifySignupBody] ,autController.signup)

   //route for post call for-- localhost:8085/ecom/api/v1/auth/signup

   app.post("/ecom/api/v1/auth/signin",[authMiddleware.verifySigninBody],autController.signin)
}