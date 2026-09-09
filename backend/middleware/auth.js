const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "Access denied. No token provided"})
    }

    const token = authHeader.split(" ")[1];

        console.log("Authorization header:", authHeader);


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            console.log("\n========== VERIFY TOKEN ==========");

        if(err){
            return res.status(401).json({
                message: "Your session has expired",
                expired: true
            });
        }
        req.userId = decoded.id;
        next();
    });

};

const authmiddleware = (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;

    if(!authHeader){
       return res.status(401).json(
                {message: "Invalid"}
            )   
    }
    const token = authHeader.split(" ")[1];

        console.log("Token exists:", !!token);

    if(!token){
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    req.userId = decoded.id;

            console.log("✅ JWT decoded:", decoded);
        console.log("Decoded ID:", decoded.id);

        req.userId = decoded.id;

        console.log("✅ req.userId:", req.userId);


    next();

    }catch(error){
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = {authmiddleware,verifyToken}
