import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// Configure Cloudinary
cloudinary.config({
    cloud_name: "damwyivrw",
    api_key: "991526879259292",
    api_secret: "IeGTN5By5mnSOWFbruTvoxRwpws"
});

export const uploadOnCloudinary = async (fileBuffer) => {
    try {
        // Ensure that the fileBuffer is valid
        if (!fileBuffer || !(fileBuffer instanceof Buffer)) {
            console.error("Invalid fileBuffer:", fileBuffer);
            throw new Error("The provided file is not a valid buffer.");
        }

        console.log("Uploading to Cloudinary...");
        const uploadResult = await new Promise((resolve, reject) => {
            // Create an upload stream to Cloudinary
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: "image" }, // Ensure it is an image
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        return reject(error);  // Reject promise on error
                    }
                    resolve(result);  // Resolve with the successful result
                }
            );

            // Convert fileBuffer to readable stream using streamifier
            const fileStream = streamifier.createReadStream(fileBuffer);

            // Log to verify that the buffer is correctly being processed
            console.log("Piping the stream...");
            fileStream.pipe(uploadStream);  // Pipe the file stream to the upload stream
        });

        console.log("Upload successful:", uploadResult.secure_url);
        return uploadResult;  // Return successful result with secure URL
    } catch (error) {
        // Catch any other unexpected errors
        console.error("Unexpected error during Cloudinary upload:", error);
        return null;  // Return null if the upload fails
    }
};
