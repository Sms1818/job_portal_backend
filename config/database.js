import mongoose from "mongoose";

const connectDatabase=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb Connected!");
        
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDatabase;