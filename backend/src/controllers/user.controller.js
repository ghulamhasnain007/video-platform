import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/users.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt, { decode } from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config/server.config.js";



const generateAccessandRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        // Return as an object
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating token")
    }
}



const registerUser = asyncHandler(async (req, res)=>{

    //get user details from frontend
    //check is the fields empty
    //validate email and username
    //check for avatar
    //upload to cloudinary
    //save user
    const {fullname, email, password, username} = req.body

    if(
        [fullname, email, password, username].some((feild)=> feild?.trim() == "")
    ){
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{email}, {username}]
    })

    if(existedUser){
        throw new ApiError(409, "Email or Usename is Already Exist")
    }

    // console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
         coverImageLocalPath = req.files?.coverImage[0]?.path
    }
    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    
    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "There is something wrong while regestring user")
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "user registered succesfully",
            true
        )
    )
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username && !email) {
            throw new ApiError(400, "Email or Username is required");
        }

        const user = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (!user) {
            return new ApiError(404, "User not found");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return new ApiError(401, "Invalid User credentials");
        }

        // Properly destructure tokens from the function
        const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
        console.log("Access Token", accessToken);
        console.log("Refresh Token", refreshToken);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully"
            ));
    } catch (error) {
        return new ApiError(400, error?.message || "something went wrong while logging user out")
    }
});

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res) =>{
    
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    
        if(!incomingRefreshToken){
            throw new ApiError(401, "unauthorized request")
        }
    
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            REFRESH_TOKEN_SECRET
        )
    
        if(!decodedToken){
            throw new ApiError(500, "invalid token request")
        }
    
        const user = await User.findById(decodedToken?._id).select("-password")
    
        if(!user){
            throw new ApiError(500, "invalid token request")
        }
    
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(500, "invalid token request")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken: newRefreshToken} = await generateAccessandRefreshToken(user._id)
        
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access Token Refreshed"
            ));
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while refreshing token")
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) =>{
    try {
        const {oldPassword, newPassword} = req.body
    
        const user = await User.findById(req?.user._id)
    
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
        if(!isPasswordCorrect){
            throw new ApiError(400, "Password is incorrect")
        }
    
        user.password = newPassword
        await user.save({validateBeforeSave: false})
    
        return res.status(200).json(new ApiResponse(200, {}, "password updated successfully"))
    } catch (error) {
        return new ApiError(500, "Something went wrong while changing password")
    }

})

const getCurrentUser = asyncHandler(async (req, res) =>{
    return res.status(200).json(new ApiResponse(200, req.user, "get user successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    try {
        const {fullname, email} = req.body
    
        if(!fullname || !email){
            throw new ApiError(400, "Please provide All fields")
        }
    
        const user = await User.findByIdAndUpdate(req.user._id,
            {
                $set: {
                    fullname,
                    email
                }
            },
            { new: true }
        ).select("-password")
    
        return res.status(200).json(new ApiResponse(200, user, "Account Details Updated Sucessfully"))
    } catch (error) {
        return new ApiError(500, "Something went wrong while updating details")
    }
})

export{
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails
}