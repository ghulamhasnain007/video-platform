import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
import { MONGO_URI } from '../config/server.config.js'


const connectDB = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${MONGO_URI}/${DB_NAME}`)
        console.log(`Connect to DB !!! DB Host: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log(`Mongo DB connection error: ${error}`)
        process.exit(1)
    }
}

export default connectDB