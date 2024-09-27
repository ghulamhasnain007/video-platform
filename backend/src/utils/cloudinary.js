import { v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } from '../config/server.config.js';



    // Configuration
cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_KEY, 
    api_secret: CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
});
    
const uploadOnCloudinary = async(localfilepath) =>{
    try {
        console.log(localfilepath);
        
        if(!localfilepath) return null;
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
        })
        fs.unlinkSync(localfilepath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }
}

export {uploadOnCloudinary}
    