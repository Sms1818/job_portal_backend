import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['Company','Candidate'],
        required:true
    }
},{timestamps:true})

const User=mongoose.model('User',userSchema);

export default User;