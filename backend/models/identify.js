import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  latitude: { type: String, required: true },
  longitude:{ type: String, required: true }
});

const Identify = mongoose.model("Identify", imageSchema); // Correct model name to 'Identify'

export default Identify; // Use default export