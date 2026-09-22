// const express = require("express");

// const router = express.Router();

// const {
//     createSubmission
// } = require("../controllers/submissionController");

// const {
//     protect
// } = require("../Middlewares/authMiddleware");

// const upload = require("../Middlewares/uploadMiddleware");


// // =====================================================
// // CREATE BOTANIST SUBMISSION
// // =====================================================

// router.post(
//     "/",
//     protect,
//     upload.array("images", 5),
//     createSubmission
// );


// module.exports = router;


const express = require('express');
const router = express.Router();

const {
    createSubmission,
    saveDraft
} = require('../controllers/submissionController');

const {protect} = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/uploadMiddleware");

router.post('/', protect, upload.single('image'),createSubmission);

router.post('/draft', protect, upload.single('image'), saveDraft);


module.exports = router;

