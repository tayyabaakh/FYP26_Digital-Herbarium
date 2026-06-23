/**
 * Flora-Digitalis Pakistan
 * ─────────────────────────────────────────────────────────
 * Auth Middleware
 *
 * Purpose:
 *   Verifies the JWT token on every protected route.
 *   Attaches decoded { userId, role } to req.user so
 *   controllers and role middleware can use it downstream.
 *
 * Usage:
 *   const { protect } = require('../middleware/authMiddleware');
 *   router.get('/me', protect, getMe);
 *
 * Token Format Expected:
 *   Authorization: Bearer <token>
 */

const jwt  = require('jsonwebtoken');
const pool = require('../config/db');

// ─────────────────────────────────────────────────────────────────────────────
// protect — verifies JWT and attaches req.user
// ─────────────────────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    // ── Step 1: Extract token from Authorization header ──────────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Token is malformed.',
      });
    }

    // ── Step 2: Verify token signature and expiry ────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Distinguish between expired and invalid tokens
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    // ── Step 3: Confirm user still exists in database ────────────────────
    // Token could be valid but user may have been deleted or deactivated
    // since the token was issued. We verify on every request.
    const [rows] = await pool.query(
      `SELECT id, name, email, role, is_active
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    const user = rows[0];

    // ── Step 4: Check account is still active ────────────────────────────
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // ── Step 5: Attach user to request object ────────────────────────────
    // Everything downstream (controllers, roleMiddleware) reads from req.user
    req.user = {
      userId: user.id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
    };

    next();

  } catch (error) {
    console.error('❌ Auth Middleware Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.',
    });
  }
};

module.exports = { protect };