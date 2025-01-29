const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const getComplaintController = require('../controllers/getComplainController');
const upload = require('../middlewares/upload');

// Routes for getting complaints and interacting with them
router.get('/', getComplaintController.getAllComplaints);
router.post('/upvote/:id', getComplaintController.upvoteComplaint);
router.post('/downvote/:id', getComplaintController.downvoteComplaint);
router.post('/comment/:id', getComplaintController.addComment);
router.post('/verify/:id', getComplaintController.verifyComplaint);

// Route to submit a new complaint with file upload
// Ensure that upload middleware is used for file uploads only, and the rest of the fields are handled in the controller
router.post('/', upload.single('file'), complaintController.submitComplaint);

module.exports = router;
