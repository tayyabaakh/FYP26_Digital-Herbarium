/**
 * Flora-Digitalis Pakistan
 * ─────────────────────────────────────────────────────────
 * Role Middleware
 *
 * Purpose:
 *   Runs AFTER protect middleware.
 *   Gates routes by role — only allows specified roles through.
 *   Rejects everyone else with 403 Forbidden.
 *
 * Usage:
 *   const { protect }        = require('../middleware/authMiddleware');
 *   const { authorizeRoles } = require('../middleware/roleMiddleware');
 *
 *   // Admin only:
 *   router.get('/dashboard', protect, authorizeRoles('admin'), handler);
 *
 *   // Botanist or Admin:
 *   router.post('/plants', protect, authorizeRoles('botanist', 'admin'), handler);
 */

// ─────────────────────────────────────────────────────────────────────────────
// authorizeRoles — factory function that returns a middleware
// ─────────────────────────────────────────────────────────────────────────────
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // protect middleware must run before this — req.user must exist
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Check if this user's role is in the allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route requires one of these roles: [${allowedRoles.join(', ')}]. Your role: ${req.user.role}`,
      });
    }

    // Role is allowed — pass control to the next handler
    next();
  };
};

module.exports = { authorizeRoles };