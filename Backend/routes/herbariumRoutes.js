const express = require("express");
const router = express.Router();
const { getHerbariumRecords, updateHerbariumRecord } = require("../controllers/herbariumController");
const upload = require('../middlewares/uploadMiddleware');

router.get("/", getHerbariumRecords);
// PUT route for updating an herbarium record with optional image upload
router.put('/:id', upload.single('image'), updateHerbariumRecord);

module.exports = router;