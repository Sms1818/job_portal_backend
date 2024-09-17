import Application from '../models/Application.js';
import Job from '../models/Job.js';

const applyJob=async(req,res)=>{
    const {jobId}=req.params;
    if(await Job.findById(jobId)==null){
        return res.status(404).json({message:"Job not found"})
    }
    const {resume}=req.body;
    try {
        const newApplication=new Application({
            candidate:req.user.userId,
            job:jobId,
            resume
        });
        await newApplication.save();
        res.status(201).json({message:"Application submitted successfully",newApplication})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error",error:error})
    }
}

const getApplications=async(req,res)=>{
    const {jobId}=req.params;
    if(await Job.findById(jobId)==null){
        return res.status(404).json({message:"Job not found"})
    }
    
    try {
        const applications=await Application.find({job:jobId}).populate('candidate','name email').populate({path: 'job',  // Populate the job information
        populate: {
          path: 'postedBy',  
          select: 'name' 
        }});
        res.status(200).json(applications)
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error",error:error})
    }
}

export { applyJob, getApplications };
