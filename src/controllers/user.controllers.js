import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res)=>{
  /*return res.status(200).json({
    message: "ok"
  })*/
 // get user details from frontend
 // validation - not empty and check if user already exists: username and email
 // check for images, check for avatar
 // upload them to cloudinary, avatar
 //create user object - create entry in db
 // remove password and refresh token field from response
 // check for user creation
 // return response 

 // sending form and json data
 const {username, email, fullname, password} = req.body
 console.log("email:", email)

 // validation check- if empty
 if ([username, email, fullname, password].some((field)=>field?.trim()==="")
){
  throw new ApiError(400, "All fields are required")
}
// check if user exists or not
const existedUser = await User.findOne({
  $or: [{username}, {email}]
})
if (existedUser) {
  throw new ApiError(409, "User with email or username already exists")
}

// file handling through multer (data handling through express)
const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;
if (!avatarLocalPath) {
  throw new ApiError(400, "Avatar file is required.")
}

// upload them to cloudinary 
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)
if (!avatar) {
  throw new ApiError(400, "Avatar file is required.")
}

// create user object and entry in db
const user = await User.create({
  fullname,
  avatar: avatar.url,
  coverImage: coverImage?.url ||"",
  email,
  password,
  username: username.toLowerCase()
})
// remove password and refreshToken and check for user creation
const createdUser = await User.findById(user._id).select("-password -refreshToken")
if (!createdUser) {
  throw new ApiError(500, "something went wrong while registering the user.")
}

// response return
return res.status(201).json(
  new ApiResponse(200, createdUser, "User Registered Successfully")
)
}) 

export {registerUser}