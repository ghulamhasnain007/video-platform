import express from "express";
import connectDB from "./db/index.js";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from 'cors'

dotenv.config({path: './env'})


const app = express()
const port = process.env.PORT

app.use(cookieParser())
app.use(cors())

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded())

app.use(express.static("public"))
connectDB()
.then(()=>{


    app.listen(port, ()=>{
        console.log(`Server is up and running on Port ${port}`)
    })
})
.catch((error)=>{
    console.log(`Failed to Connect DB!! ${error}`)
})

export {app}
