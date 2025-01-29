const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  // User details based on the provided formData state
  userDetails: {
    name: { type: String, required: true },
    photo: { type: String },  // Store the path or URL of the user's photo
    age: { type: Number },
    gender: { type: String },
    phone: { type: String },
    address: { type: String },
    appearance: {
      height: { type: String },
      clothes: { type: String }
    },
    aadharData: {
      name: { type: String },
      number: { type: Number },
      age: { type: Number },
      gender: { type: String },
      dob: { type: Date },
      address: { type: String },
      phone: {
        number: { type: Number },
        location: { type: String }
      },
      email: { type: String },
      photo: { type: String },  // Store path or URL of Aadhaar photo
      fingerprint: { type: String }
    },
    missingDate: { type: Date },
    missingTime: { type: String }
  },
  // Location information
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  // Complaint details
  // description: { type: String, required: true },
  anonymous: { type: Boolean, default: false },
  image: { type: String }, // Store the image path or URL
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  time: { type: Date, default: Date.now },
  comments: [{
    user: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
