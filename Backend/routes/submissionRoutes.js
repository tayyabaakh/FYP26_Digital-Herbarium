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

router.post('/', protect, createSubmission);

router.post('/draft', protect, saveDraft);


module.exports = router;

