import { v2 as cloudinary} from 'cloudinary';
import fs from 'fs'
import { CLOUDINARY_KEY, CLOUDINARY_SECRET } from '../config/server.config';



    // Configuration
cloudinary.config({ 
    cloud_name: CLOUDINARY_NAME, 
    api_key: CLOUDINARY_KEY, 
    api_secret: CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
});
    
    