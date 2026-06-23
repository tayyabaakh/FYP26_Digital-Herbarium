/**
 * Flora-Digitalis Pakistan
 * ─────────────────────────────────────────────────────────
 * Admin Controller
 *
 * All routes here are protected by:
 *   protect + authorizeRoles('admin')
 *
 * Endpoints:
 *   GET  /api/admin/applications              → All applications (filterable)
 *   GET  /api/admin/applications/:id          → Single application detail
 *   PUT  /api/admin/applications/:id/approve  → Approve botanist
 *   PUT  /api/admin/applications/:id/reject   → Reject botanist
 *   GET  /api/admin/users                     → All users overview
 *   PUT  /api/admin/users/:id/deactivate      → Deactivate a user account
 *   PUT  /api/admin/users/:id/activate        → Reactivate a user account
 */

const pool = require('../config/db');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/applications
// @desc    Get all botanist applications with optional status filter
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getAllApplications = async (req, res) => {
  try {
    // Optional query param: /api/admin/applications?status=pending
    const { status } = req.query;

    // Validate status filter if provided
    const allowedStatuses = ['pending', 'approved', 'rejected'];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status filter. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    // Build query dynamically based on filter
    let query = `
      SELECT
        ba.id                AS applicationId,
        ba.status,
        ba.phone,
        ba.institution,
        ba.qualification,
        ba.specialisation,
        ba.experience_years,
        ba.portfolio_url,
        ba.document_url,
        ba.rejection_reason,
        ba.applied_at,
        ba.reviewed_at,

        -- Applicant info
        u.id                 AS userId,
        u.name               AS applicantName,
        u.email              AS applicantEmail,
        u.role               AS currentRole,

        -- Reviewer info (admin who acted)
        reviewer.name        AS reviewedByName
      FROM botanist_applications ba
      INNER JOIN users u
        ON ba.user_id = u.id
      LEFT JOIN users reviewer
        ON ba.reviewed_by = reviewer.id
    `;

    const params = [];

    if (status) {
      query += ` WHERE ba.status = ?`;
      params.push(status);
    }

    query += ` ORDER BY ba.applied_at DESC`;

    const [applications] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      count:   applications.length,
      filter:  status || 'all',
      data:    applications,
    });

  } catch (error) {
    console.error('❌ getAllApplications Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/applications/:id
// @desc    Get single application with full detail
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT
        ba.id                AS applicationId,
        ba.status,
        ba.phone,
        ba.institution,
        ba.qualification,
        ba.specialisation,
        ba.experience_years,
        ba.portfolio_url,
        ba.document_url,
        ba.rejection_reason,
        ba.applied_at,
        ba.reviewed_at,

        u.id                 AS userId,
        u.name               AS applicantName,
        u.email              AS applicantEmail,
        u.role               AS currentRole,
        u.is_active          AS accountActive,
        u.created_at         AS accountCreatedAt,

        reviewer.name        AS reviewedByName,
        reviewer.email       AS reviewedByEmail
      FROM botanist_applications ba
      INNER JOIN users u
        ON ba.user_id = u.id
      LEFT JOIN users reviewer
        ON ba.reviewed_by = reviewer.id
      WHERE ba.id = ?
      LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data:    rows[0],
    });

  } catch (error) {
    console.error('❌ getApplicationById Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/admin/applications/:id/approve
// @desc    Approve a botanist application
//          → sets application status = 'approved'
//          → upgrades user role = 'botanist'
//          Both updates happen inside a transaction — either both succeed
//          or neither does. No partial state is ever saved.
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const approveApplication = async (req, res) => {
  // Get a dedicated connection from the pool for transaction control
  const connection = await pool.getConnection();

  try {
    const { id }          = req.params;
    const adminId         = req.user.userId; // from protect middleware

    // ── Step 1: Fetch the application ─────────────────────────────────────
    const [rows] = await connection.query(
      `SELECT ba.id, ba.status, ba.user_id, u.name, u.email, u.role
       FROM botanist_applications ba
       INNER JOIN users u ON ba.user_id = u.id
       WHERE ba.id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    const application = rows[0];

    // ── Step 2: Guard — only pending applications can be approved ─────────
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve. Application is already '${application.status}'.`,
        currentStatus: application.status,
      });
    }

    // ── Step 3: Begin transaction ─────────────────────────────────────────
    await connection.beginTransaction();

    // ── Step 4: Update application status → approved ──────────────────────
    await connection.query(
      `UPDATE botanist_applications
       SET
         status      = 'approved',
         reviewed_at = NOW(),
         reviewed_by = ?
       WHERE id = ?`,
      [adminId, id]
    );

    // ── Step 5: Upgrade user role → botanist ─────────────────────────────
    // This is the only legitimate way a user ever becomes a botanist.
    // No API endpoint or signup flow can do this — only admin approval.
    await connection.query(
      `UPDATE users
       SET role = 'botanist'
       WHERE id = ?`,
      [application.user_id]
    );

    // ── Step 6: Commit both updates together ──────────────────────────────
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: `Application approved. ${application.name} is now a verified botanist.`,
      data: {
        applicationId:  parseInt(id),
        userId:         application.user_id,
        applicantName:  application.name,
        applicantEmail: application.email,
        previousRole:   application.role,
        newRole:        'botanist',
        newStatus:      'approved',
        reviewedBy:     adminId,
      },
    });

  } catch (error) {
    // ── Rollback on any failure — database stays consistent ───────────────
    await connection.rollback();
    console.error('❌ approveApplication Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Approval failed. No changes were made.',
    });

  } finally {
    // ── Always release connection back to pool ────────────────────────────
    connection.release();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/admin/applications/:id/reject
// @desc    Reject a botanist application
//          → sets application status = 'rejected'
//          → user role stays 'user' (no upgrade)
//          → optional rejection_reason stored for transparency
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const rejectApplication = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id }            = req.params;
    const adminId           = req.user.userId;
    const { rejection_reason } = req.body; // optional but recommended

    // ── Step 1: Fetch the application ─────────────────────────────────────
    const [rows] = await connection.query(
      `SELECT ba.id, ba.status, ba.user_id, u.name, u.email
       FROM botanist_applications ba
       INNER JOIN users u ON ba.user_id = u.id
       WHERE ba.id = ?
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    const application = rows[0];

    // ── Step 2: Guard — only pending applications can be rejected ─────────
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject. Application is already '${application.status}'.`,
        currentStatus: application.status,
      });
    }

    // ── Step 3: Begin transaction ─────────────────────────────────────────
    await connection.beginTransaction();

    // ── Step 4: Update application status → rejected ──────────────────────
    await connection.query(
      `UPDATE botanist_applications
       SET
         status           = 'rejected',
         reviewed_at      = NOW(),
         reviewed_by      = ?,
         rejection_reason = ?
       WHERE id = ?`,
      [
        adminId,
        rejection_reason ? rejection_reason.trim() : null,
        id,
      ]
    );

    // Note: user role intentionally stays 'user' — no UPDATE on users table

    // ── Step 5: Commit ────────────────────────────────────────────────────
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: `Application rejected. ${application.name} has been notified.`,
      data: {
        applicationId:   parseInt(id),
        userId:          application.user_id,
        applicantName:   application.name,
        applicantEmail:  application.email,
        newStatus:       'rejected',
        rejectionReason: rejection_reason || null,
        reviewedBy:      adminId,
      },
    });

  } catch (error) {
    await connection.rollback();
    console.error('❌ rejectApplication Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Rejection failed. No changes were made.',
    });

  } finally {
    connection.release();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/users
// @desc    Get all users with their application status if applicable
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.is_active,
        u.created_at,

        -- Pull latest application status if exists
        ba.id          AS applicationId,
        ba.status      AS applicationStatus,
        ba.applied_at,
        ba.reviewed_at
      FROM users u
      LEFT JOIN botanist_applications ba
        ON u.id = ba.user_id
      ORDER BY u.created_at DESC`
    );

    return res.status(200).json({
      success: true,
      count:   users.length,
      data:    users,
    });

  } catch (error) {
    console.error('❌ getAllUsers Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/admin/users/:id/deactivate
// @desc    Deactivate a user account (soft ban)
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (parseInt(id) === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own admin account.',
      });
    }

    const [rows] = await pool.query(
      `SELECT id, name, email, role, is_active FROM users WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`,
      });
    }

    if (!rows[0].is_active) {
      return res.status(400).json({
        success: false,
        message: 'User is already deactivated.',
      });
    }

    await pool.query(
      `UPDATE users SET is_active = FALSE WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: `Account for ${rows[0].name} has been deactivated.`,
      data: { userId: parseInt(id), isActive: false },
    });

  } catch (error) {
    console.error('❌ deactivateUser Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to deactivate user',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/admin/users/:id/activate
// @desc    Reactivate a previously deactivated account
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, name, email, is_active FROM users WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found`,
      });
    }

    if (rows[0].is_active) {
      return res.status(400).json({
        success: false,
        message: 'User account is already active.',
      });
    }

    await pool.query(
      `UPDATE users SET is_active = TRUE WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      success: true,
      message: `Account for ${rows[0].name} has been reactivated.`,
      data: { userId: parseInt(id), isActive: true },
    });

  } catch (error) {
    console.error('❌ activateUser Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to activate user',
    });
  }
};

module.exports = {
  getAllApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  getAllUsers,
  deactivateUser,
  activateUser,
};