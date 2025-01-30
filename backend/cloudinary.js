import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'


cloudinary.config({
    cloud_name: 'dhuaeepp0',
    api_key: '598386374287393',
    api_secret: 'MX4RDSBLkAXFVfyf6Hzsnw9py6g'
});

export const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) {
            console.log("No local path provided");
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localPath)) {
            console.log("File does not exist at path:", localPath);
            return null;
        }

        const uploadResult = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        });

        // Remove the local file after upload
        fs.unlinkSync(localPath);
        return uploadResult;
 // Return successful result with secure URL
    } catch (error) {

        console.error("Error uploading to Cloudinary:", error);
        // Clean up local file if it exists
        if (localPath && fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }
        return null;
    }
};
};

