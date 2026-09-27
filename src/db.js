import mongoose from "mongoose";

export const connectDB = async () => {
    try {
         await mongoose.connect('mongodb+srv://lauromero28004_db_user:28Lo_La04@bowlingpro.lsdrybk.mongodb.net/?appName=bowlingpro');
         console.log(">>> DB is connected")
    } catch (error) {
        console.log(error)
    }
   
};