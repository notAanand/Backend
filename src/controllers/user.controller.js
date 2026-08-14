import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {User} from '../models/user.model.js'
import {uploadeOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {

    const { email, fullName, userName, password } = req.body;

    console.log("email:", email);
    console.log("username:", userName);
    console.log("files:", req.files);

    if ([fullName, email, userName, password]
        .some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are Required");
    }

    const existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    });

    if (existingUser) {
        throw new ApiError(409, "UserName or Email Already Exists");
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length()>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }

    console.log("Avatar Local Path:", avatarLocalPath);
    console.log("Cover Local Path:", coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required");
    }

    const avatar = await uploadeOnCloudinary(avatarLocalPath);

    const coverImage = await uploadeOnCloudinary(coverImageLocalPath);

    console.log("Avatar Cloudinary Response:", avatar);
    console.log("Cover Cloudinary Response:", coverImage);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.secure_url,
        coverImage: coverImage?.secure_url || "",
        password,
        email,
        userName,
    });

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,
            "User registered successfully"
        )
    );
});

export {registerUser}