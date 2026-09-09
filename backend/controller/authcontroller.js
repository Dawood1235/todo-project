const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


const signup = async(req,res)=>{
    try{
        const{
            firstName,
            lastName,
            email,
            password
        } = req.body

        const existingUser = await User.findOne({email});
        
        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "user"
        });

        res.status(201).json({
            message: "User Succesfully added",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

const signin = async (req,res)=>{
    try{
        const{
        email,
        password
        } = req.body
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid email or Password"
            })
        }
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
            }
        })
    } catch(error){
        console.error("Signin error:", error);

        res.status(500).json({
            message: error.message
        });
    }
};   

module.exports = {signup,signin};
