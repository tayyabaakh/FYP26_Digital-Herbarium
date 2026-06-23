/**
 * Flora-Digitalis Pakistan
 * ─────────────────────────────────────────────────────────
 * Admin Routes
 *
 * Mounted at: /api/admin
 *
 * Every single route here is protected by:
 *   1. protect          → valid JWT required
 *   2. authorizeRoles   → role must be 'admin'
 *
 * No botanist or public user can reach any of these endpoints.
 */

const express = require('express');
const router = express.Router();
const {
    getAllApplications,
    getApplicationById,
    approveApplication,
    rejectApplication,
    getAllUsers,
    deactivateUser,
    activateUser,
} = require('../controllers/adminController');
const { protect } = require('../Middlewares/authMiddleware');
const { authorizeRoles } = require('../Middlewares/roleMiddleware');

// Every route below gets both middleware applied
const adminOnly = [protect, authorizeRoles('admin')];

// ─── Application Management ───────────────────────────────────────────────────

// GET  /api/admin/applications?status=pending  → all applications (filterable)
router.get('/applications', ...adminOnly, getAllApplications);

// GET  /api/admin/applications/:id             → single application detail
router.get('/applications/:id', ...adminOnly, getApplicationById);

// PUT  /api/admin/applications/:id/approve     → approve botanist application
router.put('/applications/:id/approve', ...adminOnly, approveApplication);

// PUT  /api/admin/applications/:id/reject      → reject botanist application
router.put('/applications/:id/reject', ...adminOnly, rejectApplication);

// ─── User Management ──────────────────────────────────────────────────────────

// GET  /api/admin/users                        → all users with application data
router.get('/users', ...adminOnly, getAllUsers);

// PUT  /api/admin/users/:id/deactivate         → soft ban a user
router.put('/users/:id/deactivate', ...adminOnly, deactivateUser);

// PUT  /api/admin/users/:id/activate           → reactivate a user
router.put('/users/:id/activate', ...adminOnly, activateUser);

module.exports = router;