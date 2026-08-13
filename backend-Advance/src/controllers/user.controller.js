import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.model.js'
import {uploadeOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async(req,res)=>{
    const {email,fullName,userName,password}=req.body
    console.log("email : ",email);

    if ([fullName,email,userName,password].some((fields)=>fields?.trim()==="")) {
        throw new ApiError(400,"All Fields are Required")
    }
    const exisitingUser = User.findOne({
        $or:[{userName},{email}]
    })
    if(exisitingUser){
        throw new ApiError(409,"UserName or Email Already Exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(455,"Avatar is Required")
    }
    const avatar = await uploadeOnCloudinary(avatarLocalPath)
    const coverImage = await uploadeOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(455,"Avatar is Required")
    }
    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || " ",
        password,
        email,
        username,
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )

})

export {registerUser}