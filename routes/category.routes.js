//post call for this ip
const category_controller=require("../controllers/category.controller")
const auth_mw= require("../middleware/auth.middleware")

module.exports=(app)=>{
    app.post("/ecom/api/v1/auth/categories",[auth_mw.verifyToken,auth_mw.isAdmin],category_controller.createNewCategory)
}