import express from 'express';
import { upload, uploadToCloudinary } from '../middlewares/upload.js'; // Correct import
import Identify from '../models/identify.js'; // Ensure the correct model import

const router = express.Router(); // Initialize the router

// POST route to upload an image
router.post('/upload', upload.single('image'), uploadToCloudinary, async (req, res) => {
    try {
        if (!req.imageUrl) {
            return res.status(400).json({ message: 'Image upload failed' });
        }

        // Create a new document in MongoDB
        const newImage = new Identify({
            imageUrl: req.imageUrl, // Store the Cloudinary URL
            description: req.body.description,
        });

        console.log('Uploaded Image URL:', newImage.imageUrl);
        console.log('Description:', newImage.description);

        await newImage.save(); // Save to database
        res.status(200).json(newImage); // Send back the image data
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading image', error });
    }
});

// GET route to fetch all uploaded images
router.get('/images', async (req, res) => {
    try {
        const images = await Identify.find(); // Fetch all images from the database
        res.status(200).json(images); // Send the images data back to the client
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ message: 'Error retrieving images', error });
    }
});

export default router; // Export the router
