

const express        = require('express');
const router         = express.Router();
const {
  applyAsBotanist,
  login,
  getMe,
}                    = require('../controllers/authController');
const { protect } = require('../Middlewares/authMiddleware');

// ─── Public Routes ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/apply
 * Botanist application form submission.
 * Creates account with role='user', status='pending'.
 * No token issued — must wait for admin approval.
 */
router.post('/apply', applyAsBotanist);

/**
 * POST /api/auth/login
 * Accepts: { email, password }
 * Allowed: admin, approved botanists
 * Blocked: pending/rejected applicants, deactivated accounts
 */
router.post('/login', login);

// ─── Private Routes (protected in Phase 3) ───────────────────────────────────

/**
 * GET /api/auth/me
 * Returns profile of the currently logged-in user.
 * authMiddleware (protect) will be added in Phase 3.
 * Placeholder comment marks where it plugs in:
 *
 *   router.get('/me', protect, getMe);
 *
 * For now registered without middleware for structure clarity.
 */
router.get('/me',protect, getMe);

module.exports = router;