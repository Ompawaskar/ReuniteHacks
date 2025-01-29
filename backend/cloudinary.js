import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const uploadOnCloudinary = async (file) => {
    try {
        const uploadResult = await new Promise((resolve) => {
            cloudinary.uploader.upload_stream((error, uploadResult) => {
                return resolve(uploadResult);
            }).end(file);
        });
        return uploadResult

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
};