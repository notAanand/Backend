import "dotenv/config";
import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

const uploadeOnCloudinary = async(loaclStoragePath)=>{
    try {
        if(!loaclStoragePath)return null;
        const response =await cloudinary.uploader.upload(loaclStoragePath,{
            resource_type:'auto'
        })
        console.log("file is uploaded SuccessFully :",response.url)
        fs.unlinkSync(loaclStoragePath)
        return response
    } catch (error) {
        fs.unlinkSync(loaclStoragePath);
        console.log('something is wrong with Cloudinary')
        // console.log("CLOUDINARY CONFIG:", cloudinary.config());
        console.log('error :- ',error);
        
        
        return null;
    }
}

export {uploadeOnCloudinary}