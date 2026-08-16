import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from "../utils/ApiError.js"
import { User } from '../models/user.model.js'
import { uploadeOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'

const generateRefreshTokenAndAccessToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const AccessToken = user.generateAccessToken()
        const RefreshToken = user.generateRefreshToken()
        user.refreshToken = RefreshToken
        await user.save({ validateBeforeSave: false })
        return { AccessToken, RefreshToken }
    } catch (error) {
        throw new ApiError(500, 'Something Went wrong while generating AccessToken or RefreshToken')

    }
}

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
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length() > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
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
const loginUser = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body
    if (!userName || !email) {
        throw new ApiError(400, "UserName or Email is required")

    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    })
    if (!user) {
        throw new ApiError(404, "User with this Email and UserName Does not Exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Password Is Incorrect")
    }

    const { refreshToken, accessToken } = await generateRefreshTokenAndAccessToken(user._id)

    const loggedInUser = await User.findOne(user._id).select("-password -refreshToken")
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: refreshToken, loggedInUser, accessToken
                },

                "User loggedIn Successfully"
            )
        )

})
const logOutUser =asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken:undefined}
        },{new:true}
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User LoggedOut Successfullyy"))
})

export { registerUser, loginUser,logOutUser }