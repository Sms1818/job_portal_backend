import mongoose from "mongoose";

const connectDatabase=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS: 5000});
        console.log("MongoDB Connected successfully!");
        
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error.message}`);
        console.error(error.stack);
        process.exit(1);
    }
};

export default connectDatabase;