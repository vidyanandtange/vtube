import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null
    // upload the files
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type:"auto"
    })
    console.log("The file successfully uploaded on cloudinary.", response.url)
    //fs.unlinkSync(localFilePath)
    return response  
  } catch (error) {
    // remove the local saved file after the upload operation failed
    fs.unlinkSync(localFilePath)
    console.log("Something went wrong in utils/cloudinary", error)
    return null
  }
}

export {uploadOnCloudinary};