const express = require('express');
const router = express.Router();

const {
    createSubmission,
    saveDraft,
    getMySubmissions,
    rejectSubmission,
    approveSubmission,
    getAllSubmissionsForAdmin
} = require('../controllers/submissionController');

// 1. Import 'protect' from authMiddleware
const { protect } = require("../Middlewares/authMiddleware");

// 2. Import 'authorizeRoles' from roleMiddleware
const { authorizeRoles } = require("../Middlewares/roleMiddleware");

// 3. File upload middleware
const upload = require("../Middlewares/uploadMiddleware");


// =====================================================
// BOTANIST SUBMISSION ROUTES
// =====================================================
router.post('/', protect, upload.single('image'), createSubmission);
router.post('/draft', protect, upload.single('image'), saveDraft);
router.get("/my", protect, getMySubmissions);


// =====================================================
// ADMIN REVIEW ROUTES
// =====================================================
router.get('/admin/all', protect, authorizeRoles('admin'), getAllSubmissionsForAdmin);
router.put('/admin/approve/:id', protect, authorizeRoles('admin'), approveSubmission);
router.put('/admin/reject/:id', protect, authorizeRoles('admin'), rejectSubmission);

module.exports = router;