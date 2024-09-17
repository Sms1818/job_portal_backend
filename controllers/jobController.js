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

export { getJobDetails, postJob }



