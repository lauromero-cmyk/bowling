import mongoose from "mongoose";

export const connectDB = async () => {
    try {
         // Usa MONGODB_URI del archivo .env. (Recomendado: quitar la cadena de abajo y dejar solo el .env)
         await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://lauromero28004_db_user:28Lo_La04@bowlingpro.lsdrybk.mongodb.net/?appName=bowlingpro');
         console.log(">>> DB is connected")
    } catch (error) {
        console.log(error)
    }
   
};