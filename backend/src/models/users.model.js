import mongoose, {Schema} from 'mongoose'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIY, REFRESH_TOKEN_SECRET, SECRET_KEY } from '../config/server.config.js'

const userSchema = new Schema({
    username:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true, 
        required: true,
        index: true
    },
    email :{
        type: String,
        unique: true,
        lowercase: true,
        trim: true, 
        required: true
    },
    fullname :{
        type : String,
        lowercase : true,
        trim : true, 
        required : true,
        index : true
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory : [
        {
            type: Schema.Types.ObjectId,
            ref :"Video"
        }
    ],
    password: {
        type: String,
        required: [true, "password is required"]
    },
    refreshToken :{
        type: String
    }

}, {timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email: this.email
        },
        SECRET_KEY,
        {expiresIn: ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        REFRESH_TOKEN_SECRET,
        {expiresIn: REFRESH_TOKEN_EXPIY}
    )
}

export const User = mongoose.model('User', userSchema)