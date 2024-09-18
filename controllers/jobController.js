import Job from '../models/Job.js';
import User from '../models/User.js';

const postJob=async(req,res)=>{
    const {title,description,location,salary}=req.body;
    if (!title || !description || !location || !salary) {
        return res.status(400).json({ message: "All fields (title, description, location, salary) are required" });
    }

    try{
        const newJob=await new Job({
            title,
            description,
            location,
            salary,
            postedBy:req.user.userId
        })
        await newJob.save()
        return res.status(201).json({message:"Job posted successfully",newJob})

    }catch(error){
        console.error("Error while posting a job: ",error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }

}


const getJobDetails=async(req,res)=>{
    try {
        const jobDetails=await Job.find()
        .populate({
            path: 'postedBy', select: 'name' 
        });
        if(jobDetails.length>0){
            return res.status(200).json({jobs: jobDetails})
        }else{
            return res.status(200).json({message:"Currently no jobs available"});
        }
    } catch (error) {
        console.error("Error while fetching job details: ",error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }
    
}

const getJobDetailsById=async(req,res)=>{
    const{id}=req.params
    try {
        const jobDetail=await Job.findById(id)
        .populate({
            path: 'postedBy', select: 'name' 
        });
        if (!jobDetail) {
            return res.status(404).json({ message: "Job not found" });
        }
        return res.status(200).json({job: jobDetail})
    } catch (error) {
        console.error("Error while fetching particular job detail: ",error.message);
        return res.status(500).json({message:'Internal Server Error',error:error})
    }
}

const getJobDetailsforSpecificCompany=async(req,res)=>{
    const{userId}=req.params
    try {
        const company = await User.findById(userId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }
        const jobDetails = await Job.find({ postedBy: userId })
        .populate({
            path: 'postedBy', select: 'name' 
        });
        return res.status(200).json({ jobs: jobDetails });
    } catch (error) {
        console.error("Error while fetching company's jobs: ",error.message);
        return res.status(500).json({message:'Internal Server Error',error:error})
    }
}


const updateJobDetails=async(req,res)=>{
    const {id}=req.params;
    if(await Job.findById(id)==null){
        return res.status(404).json({message:"Job not found"})
    }

    const {title,description,location,salary}=req.body;
    try {
        const updatedJob=await Job.findByIdAndUpdate(id,{title,description,location,salary},{new:true})
        return res.status(200).json({message:'Updated Job successfully',updatedJob})
    } catch (error) {
        console.error("Error while updating a job",error.message);
        return res.status(500).json({message:'Internal Server Error'})
    }
}

const deleteJob=async(req,res)=>{
    const {id}=req.params;
    if(await Job.findById(id)==null){
        return res.status(404).json({message:"Job not found"})
    }
    try {
        const job=await Job.findByIdAndDelete(id);
        return res.status(200).json({message:'Job Deleted successfully'})
    } catch (error) {
        console.error("Error while deleting a job: ",error.message);
        return res.status(500).json({message:'Internal Server Error'})
    }
}

export { deleteJob, getJobDetails, getJobDetailsById, getJobDetailsforSpecificCompany, postJob, updateJobDetails };



