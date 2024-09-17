import mongoose from "mongoose";

const jobSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,
    },
    salary:{
        type:Number,
        required:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
},{timestamps:true})

const Job=mongoose.model('Job',JobSchema);

export default Job;