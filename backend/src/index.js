import connectDB from "./db/index.js"
import {app} from './app.js'
import { PORT } from "./config/server.config.js";



connectDB()
.then(() => {
    app.listen(PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
