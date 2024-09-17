import Job from '../models/Job.js'

const postJob=async(req,res)=>{
    const {title,description,location,salary}=req.body
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
        return res.status(500).json({message:"Internal Server Error"})
    }

}


const getJobDetails=async(req,res)=>{
    try {
        const jobDetails=await Job.find();
        if(jobDetails.length>0){
            return res.status(200).json({jobDetails})
        }else{
            return res.status(200).json({message:"Currently no jobs available"});
        }
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }
    
}

const getJobDetailsById=async(req,res)=>{
    const{id}=req.params
    if(await Job.findById(id)==null){
        return res.status(404).json({message:"Job not found"})
    }
    try {
        const jobDetail=await Job.findById(id);
        return res.status(200).json(jobDetail)
    } catch (error) {
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
        return res.status(500).json({message:'Internal Server Error'})
    }
}

export { deleteJob, getJobDetails, getJobDetailsById, postJob, updateJobDetails }



