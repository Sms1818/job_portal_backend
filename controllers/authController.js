import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const registerUser=async(req,res)=>{
    const {name,email,password,role}=req.body;

    try{
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({msg:'User already exists'})
        }



        const hashPwd= await bcrypt.hash(password,10);

        const newUser=new User({
            name,
            email,
            password:hashPwd,
            role
        })

        await newUser.save();
        res.status(201).json({msg:'User created successfully',newUser})
    }
    catch(error){
        console.log("Error while registeration!",error.message);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}

const loginUser=async(req,res)=>{
    const {email,password}=req.body;

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({msg:'User not found'})
        }

        const checkPassword= await bcrypt.compare(password,user.password);
        if(!checkPassword){
            return res.status(400).json({msg:'Invalid password'})
        }

        if (!process.env.SECRET_KEY) {
            return res.status(500).json({ message: 'Missing secret key.'});
        }

        const token=jwt.sign(
            {
                userId:user._id, 
                role:user.role
            },
            process.env.SECRET_KEY,
            {expiresIn:'3h'}
        )

        return res.status(200).json({message:'Login Successful',token});
    }
    catch(error){
        console.log("Error while login the user!",error.message);
        return res.status(500).json({msg:'Internal Server Error'});
    }
}

export { loginUser, registerUser };


