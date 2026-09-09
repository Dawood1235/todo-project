const User = require("../models/user");

const rolemiddleware =(requiredRole)=>{
    return async(req,res,next) =>{
    try{
        const user = await User.findById(req.userId);

    if(!user){
       return res.status(404).json(
                {message: "User not found"}
            )   
    }

    if(user.role !== requiredRole){
        return res.status(403).json({
            message: "Access Denied"
        });
    }

    next();

    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
  }
};

module.exports = {rolemiddleware}
