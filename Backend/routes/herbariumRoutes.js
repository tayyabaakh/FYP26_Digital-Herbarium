const express = require("express");
const router = express.Router();
const { getHerbariumRecords } = require("../controllers/herbariumController");

router.get("/", getHerbariumRecords);

module.exports = router;