const express = require("express");

const router = express.Router();

const {
    getMyProfile
} = require("../controllers/profileController");

const {
    updateMyProfile
} = require("../controllers/profileController");

const {
    updateMySettings
} = require("../controllers/profileController");
const {
    protect
} = require("../Middlewares/authMiddleware");


// GET /api/profile/me
router.get(
    "/me",
    protect,
    getMyProfile
);
router.put(
    "/me",
    protect,
    updateMyProfile
);
router.patch(
    "/settings",
    protect,
    updateMySettings
);

module.exports = router;