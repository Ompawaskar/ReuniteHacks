import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

// Create an Express router
const router = express.Router();

// Middleware to parse JSON bodies
router.use(bodyParser.json());

// MongoDB Atlas connection string
const mongoURI = process.env.MONGODB_URL;


// Define the Aadhaar Schema
const AadhaarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: Number, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  phone:{
    number:{ type: Number, required: true },
    location:{ type: String, required: true }
  },
  email: { type: String, required: true },
  photo: { type: String, required: true }, // Base64 encoded
  fingerprint: { type: String, required: true }, // Base64 encoded
});

// Create a model from the schema
const Aadhaar = mongoose.model('Aadhaar', AadhaarSchema);

// POST route to add Aadhaar data to MongoDB
router.post('/aadhar', async (req, res) => {
  const { name, number, age, gender, dob, address, email, photo, fingerprint } = req.body;

  // Basic validation
  if (!name || !age || !gender || !dob || !address || !email || !photo || !fingerprint) {
    return res.status(400).send('All fields are required');
  }

  try {
    // Create a new Aadhaar document
    const newAadhaar = new Aadhaar({
      name,
      number,
      age,
      gender,
      dob,
      address,
      email,
      photo, // Base64 encoded photo
      fingerprint, // Base64 encoded fingerprint
    });

    // Save the Aadhaar data to MongoDB
    await newAadhaar.save();
    res.status(201).send('Aadhaar data added successfully');
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Error saving Aadhaar data to MongoDB');
  }
});

// GET route to fetch all Aadhaar data
router.get('/aadhars', async (req, res) => {
  try {
    const aadhars = await Aadhaar.find();
    res.status(200).json(aadhars);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching Aadhaar data');
  }
});

// GET route to fetch Aadhaar data by name
router.get('/aadhar/name/:name', async (req, res) => {
  const { name } = req.params;

  try {
    const aadhar = await Aadhaar.find({ name: new RegExp(name, 'i') }); // 'i' for case-insensitive search
    if (aadhar.length > 0) {
      res.status(200).json(aadhar);
    } else {
      res.status(404).send('No Aadhaar data found for the given name');
    }
  } catch (err) {
    console.error('Error fetching data by name:', err);
    res.status(500).send('Error fetching Aadhaar data by name');
  }
});

// GET route to fetch Aadhaar data by Aadhaar number
router.get('/aadhar/number/:number', async (req, res) => {
  const { number } = req.params;

  try {
    const aadhar = await Aadhaar.findOne({ number: number });
    if (aadhar) {
      res.status(200).json(aadhar);
    } else {
      res.status(404).send('No Aadhaar data found for the given number');
    }
  } catch (err) {
    console.error('Error fetching data by number:', err);
    res.status(500).send('Error fetching Aadhaar data by number');
  }
});

export default router;
