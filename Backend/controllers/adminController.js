/**
 * Flora-Digitalis Pakistan
 * ─────────────────────────────────────────────────────────
 * Admin Controller
 *
 * All routes here are protected by:
 *   protect + authorizeRoles('admin')
 *
 * Endpoints:
 *   GET  /api/admin/applications            → All applications (filterable)
 *   GET  /api/admin/applications/:id        → Single application detail
 *   PUT  /api/admin/applications/:id/approve  → Approve botanist & create account
 *   PUT  /api/admin/applications/:id/reject   → Reject botanist application
 *   GET  /api/admin/users                   → All users overview
 *   PUT  /api/admin/users/:id/deactivate    → Deactivate a user account
 *   PUT  /api/admin/users/:id/activate      → Reactivate a user account
 */

const pool = require('../config/db');

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/applications
// @desc    Get all botanist applications with optional status filter
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const allowedStatuses = ['pending', 'approved', 'rejected'];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status filter. Allowed values: ${allowedStatuses.join(', ')}`,
      });
    }

    let query = `
      SELECT
        ba.id                AS applicationId,
        ba.full_name         AS applicantName,
        ba.email             AS applicantEmail,
        ba.phone,
        ba.institution,
        ba.qualification,
        ba.specialisation,
        ba.experience_years,
        ba.portfolio_url,
        ba.document_url,
        ba.status,
        ba.rejection_reason,
        ba.applied_at,
        ba.reviewed_at,

        -- Reviewer info (admin who acted)
        reviewer.name        AS reviewedByName,
        reviewer.email       AS reviewedByEmail
      FROM botanist_applications ba
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
      count: applications.length,
      filter: status || 'all',
      data: applications,
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
        ba.full_name         AS applicantName,
        ba.email             AS applicantEmail,
        ba.phone,
        ba.institution,
        ba.qualification,
        ba.specialisation,
        ba.experience_years,
        ba.portfolio_url,
        ba.document_url,
        ba.status,
        ba.rejection_reason,
        ba.applied_at,
        ba.reviewed_at,

        reviewer.name        AS reviewedByName,
        reviewer.email       AS reviewedByEmail
      FROM botanist_applications ba
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
      data: rows[0],
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
//          → Inserts user into `users` table with 'botanist' role
//          → Sets application status = 'approved' and records reviewer ID
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const approveApplication = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const adminId = req.user.userId;

    // ── Step 1: Fetch application ─────────────────────────────────────────
    const [apps] = await connection.query(
      `SELECT * FROM botanist_applications WHERE id = ? LIMIT 1`,
      [id]
    );

    if (apps.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    const app = apps[0];

    // ── Step 2: Guard — check status ──────────────────────────────────────
    if (app.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve. Application is already '${app.status}'.`,
      });
    }

    // ── Step 3: Check if email already exists in users table ──────────────
    const [existingUsers] = await connection.query(
      `SELECT id FROM users WHERE email = ? LIMIT 1`,
      [app.email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: `A user account with email '${app.email}' already exists.`,
      });
    }

    // ── Step 4: Handle Password ───────────────────────────────────────────
    // If password isn't in botanist_applications, set a default temporary hashed password
    let userPassword = app.password;
    if (!userPassword) {
      const defaultTempPass = 'Botanist@123'; 
      userPassword = await bcrypt.hash(defaultTempPass, 10);
    }

    // ── Step 5: Begin transaction ─────────────────────────────────────────
    await connection.beginTransaction();

    // ── Step 6: Insert into users table ───────────────────────────────────
const [userResult] = await connection.query(
  `INSERT INTO users (
     name, 
     email, 
     password, 
     role, 
     is_active, 
     phone, 
     institution, 
     qualification, 
     specialisation, 
     experience_years, 
     portfolio_url, 
     document_url
   ) VALUES (?, ?, ?, 'botanist', TRUE, ?, ?, ?, ?, ?, ?, ?)`,
  [
    app.full_name,
    app.email,
    userPassword,
    app.phone || null,
    app.institution || null,
    app.qualification || null,
    app.specialisation || null,
    app.experience_years || null,
    app.portfolio_url || null,
    app.document_url || null,
  ]
);

    const newUserId = userResult.insertId;

    // ── Step 7: Update application status ────────────────────────────────
    await connection.query(
      `UPDATE botanist_applications
       SET 
         status = 'approved',
         reviewed_at = NOW(),
         reviewed_by = ?
       WHERE id = ?`,
      [adminId, id]
    );

    // ── Step 8: Commit transaction ─────────────────────────────────────────
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: `Application approved successfully. User account created for ${app.full_name}.`,
      data: {
        applicationId: parseInt(id),
        newUserId,
        applicantName: app.full_name,
        applicantEmail: app.email,
        role: 'botanist',
        status: 'approved',
      },
    });

  } catch (error) {
    await connection.rollback();
    console.error('❌ approveApplication Error:', error); // Log full error object to see MySQL error details
    return res.status(500).json({
      success: false,
      message: 'Failed to approve application',
      error: error.message, // Send error message back during debugging
    });
  } finally {
    connection.release();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   PUT /api/admin/applications/:id/reject
// @desc    Reject a botanist application
//          → sets application status = 'rejected'
//          → stores optional rejection_reason
// @access  Admin only
// ─────────────────────────────────────────────────────────────────────────────
const rejectApplication = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const adminId = req.user.userId;
    const { rejection_reason } = req.body;

    // ── Step 1: Fetch application ─────────────────────────────────────────
    const [apps] = await connection.query(
      `SELECT * FROM botanist_applications WHERE id = ? LIMIT 1`,
      [id]
    );

    if (apps.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Application with ID ${id} not found`,
      });
    }

    const app = apps[0];

    // ── Step 2: Guard — check status ──────────────────────────────────────
    if (app.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject. Application is already '${app.status}'.`,
      });
    }

    // ── Step 3: Update application status to rejected ─────────────────────
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

    return res.status(200).json({
      success: true,
      message: `Application rejected for ${app.full_name}.`,
      data: {
        applicationId: parseInt(id),
        applicantName: app.full_name,
        status: 'rejected',
        rejectionReason: rejection_reason || null,
      },
    });

  } catch (error) {
    console.error('❌ rejectApplication Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject application',
    });
  } finally {
    connection.release();
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @route   GET /api/admin/users
// @desc    Get all users in the system
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
        u.created_at
      FROM users u
      ORDER BY u.created_at DESC`
    );

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
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