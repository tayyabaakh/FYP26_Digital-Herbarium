const express = require("express");

const router = express.Router();

const {
    getBotanistDashboard
} = require("../controllers/dashboardController");

const {
    protect
} = require("../Middlewares/authMiddleware");


/**
 * GET /api/botanist/dashboard
 *
 * Protected route.
 */
router.get(
    "/dashboard",
    protect,
    getBotanistDashboard
);


module.exports = router;