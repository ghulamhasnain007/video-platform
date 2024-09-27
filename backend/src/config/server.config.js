import dotenv from "dotenv"

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const REFRESH_TOKEN_EXPIY = process.env.REFRESH_TOKEN_EXPIY
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET
const CLOUDINARY_URL = process.env.CLOUDINARY_URL

export{
    SECRET_KEY,
    PORT,
    MONGO_URI,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIY,
    CLOUDINARY_NAME,
    CLOUDINARY_KEY,
    CLOUDINARY_SECRET,
    CLOUDINARY_URL
}