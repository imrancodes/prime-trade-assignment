import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Database Connection Successfully');
    }catch(err){
        console.log("connection fail",  err);
        process.exit(1);
    }
}