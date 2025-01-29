const Complaint = require('../models/complaint');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyB7kjPOLBCWChhdbP3vSXGDC7HAWzpv3Rg');

exports.submitComplaint = async (req, res) => {
  try {
    console.log('Received complaint submission:', req.body);
    console.log('File:', req.file);

    // Destructure form data from the body
    const { name, age, gender, phone, address, appearance, aadharData, missingDate, missingTime, description, location } = req.body;

    // Validate required fields (You might want to add more checks)
    if (!name || !age || !gender || !missingDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Handle file upload if there's a photo
    const imagePath = req.file ? req.file.path : null;  // Make imagePath optional
    console.log('Image path:', imagePath);

    // If there's a photo or description, analyze it using Gemini AI
    let geminiAnalysis = null;
    if (description || imagePath) {
      console.log('Analyzing complaint with Gemini...');
      geminiAnalysis = await analyzeComplaintWithGemini(description, imagePath);
      console.log('Gemini analysis result:', geminiAnalysis);
    }

    // Save the complaint to the database
    const complaint = new Complaint({
      userDetails: {
        name,
        photo: imagePath ? imagePath : null,  // Save the path of the uploaded photo if available
        age,
        gender,
        phone,
        address,
        appearance,
        aadharData,
        missingDate,
        missingTime
      },
      // description,// Convert anonymous to boolean
      image: imagePath,  // Save the image path or null
      location: location ? JSON.parse(location) : null,  // Parse location string to JSON if present
      // geminiAnalysis,  // Only include gemini analysis if it was done
    });

    console.log('Complaint object to be saved:', complaint);

    // Save the complaint to database
    await complaint.save();
    console.log('Complaint saved successfully');

    res.status(201).json({ message: 'Complaint registered successfully', complaint });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({
      message: 'Error submitting complaint',
      error: error.message,
      stack: error.stack,
    });
  }
};

// // Analyze complaint with Gemini AI (using description and image if available)
// async function analyzeComplaintWithGemini(description, imagePath) {
//   try {
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//     let imageData = null;
//     if (imagePath) {
//       console.log('Reading image file:', imagePath);
//       const imageBuffer = fs.readFileSync(imagePath);
//       imageData = {
//         inlineData: {
//           data: imageBuffer.toString('base64'),  // Convert image to Base64
//           mimeType: 'image/jpeg',  // Adjust based on your image type (e.g., png, jpg)
//         },
//       };
//     }

//     // Construct the prompt for Gemini API
//     const prompt = `Analyze this complaint:
//     Description: ${description}

//     Tasks:
//     1. If an image is provided, describe it in detail.
//     2. Determine if the image (if provided) matches the description.
//     3. Assess the authenticity and seriousness of the complaint.
//     4. Categorize the incident level as: Low Priority, Medium Priority, High Priority, or Very High Priority.
//     5. Provide any additional relevant details or insights.

//     Format your response as a JSON object with these keys: imageDescription, descriptionMatch, incidentLevel, additionalDetails`;

//     console.log('Sending request to Gemini API...');
//     const result = await model.generateContent([prompt, imageData]);

//     // Check if result and response are valid
//     if (!result || !result.response) {
//       throw new Error('Invalid response from Gemini API');
//     }

//     const responseText = await result.response.text();
//     console.log('Gemini API response:', responseText);

//     const pdata = responseText.replace(/```json\s*|\s*```/g, '').trim();

//     try {
//       return JSON.parse(pdata);  // Parse the JSON response from Gemini
//     } catch (jsonError) {
//       console.error('Error parsing Gemini API response:', jsonError);
//       return { error: 'Failed to parse response from Gemini API' };
//     }
//   } catch (error) {
//     console.error('Error in Gemini analysis:', error);
//     return { error: error.message };  // Return error as part of the analysis result
//   }
// }
