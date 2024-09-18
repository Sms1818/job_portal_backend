import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

const applyJob=async(req,res)=>{
    const {jobId}=req.params;
    if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID format" });
    }
    if(await Job.findById(jobId)==null){
        return res.status(404).json({message:"Job not found"})
    }
   
    try {
        const application=await Application.findOne({
            candidate:req.user.userId,
            job:jobId
        })

        if(application){
            return res.status(400).json({message:'You have already applied for this role'});
        }
        const {resume}=req.body;
        if (!resume) {
            return res.status(400).json({ message: 'Resume is required to apply for the job' });
        }
        const newApplication=new Application({
            candidate:req.user.userId,
            job:jobId,
            resume
        });
        await newApplication.save();
        res.status(201).json({message:"Application submitted successfully",newApplication})
    } catch (error) {
        console.error("Error while applying for a job : ",error.message);
        return res.status(500).json({message:"Internal Server Error",error:error})
    }
}

const getApplications=async(req,res)=>{
    const {jobId}=req.params;
    if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({ message: "Invalid Job ID format" });
    }
    if(await Job.findById(jobId)==null){
        return res.status(404).json({message:"Job not found"})
    }
    
    try {
        const applications=await Application.find({job:jobId})
        .populate('candidate','name email')
        .populate({
            path: 'job',
            populate: {path: 'postedBy', select: 'name' 
        }});
        res.status(200).json(applications)
    } catch (error) {
        console.error("Error while fetching the application details",error.message);
        return res.status(500).json({message:"Internal Server Error",error:error})
    }
}

export { applyJob, getApplications };
