import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { DB_NAME } from '../constants.js'

dotenv.config()

const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`Connect to DB !!! DB Host: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log(`Mongo DB connection error: ${error}`)
        process.exit(1)
    }
}

export default connectDB