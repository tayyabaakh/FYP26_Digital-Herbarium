const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Metric Cards Summary
    const [[{ totalUsers }]] = await pool.query(`SELECT COUNT(*) AS totalUsers FROM users`);
    const [[{ totalBotanists }]] = await pool.query(`SELECT COUNT(*) AS totalBotanists FROM users WHERE role = 'botanist'`);
    const [[{ pendingApps }]] = await pool.query(`SELECT COUNT(*) AS pendingApps FROM botanist_applications WHERE status = 'pending'`);
    const [[{ pendingSubs }]] = await pool.query(`SELECT COUNT(*) AS pendingSubs FROM botanist_submissions WHERE status = 'pending'`);
    const [[{ approvedRecords }]] = await pool.query(`SELECT COUNT(*) AS approvedRecords FROM botanist_submissions WHERE status = 'approved'`);
    const [[{ rejectedCount }]] = await pool.query(`SELECT COUNT(*) AS rejectedCount FROM botanist_submissions WHERE status = 'rejected'`);

    // 2. Submission Trends (Last 6 Months)
    const [trends] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%b') AS month,
        COUNT(*) AS Submitted,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS Approved
      FROM botanist_submissions
      GROUP BY YEAR(created_at), MONTH(created_at), DATE_FORMAT(created_at, '%b')
      ORDER BY MIN(created_at) ASC
      LIMIT 6
    `);

    // 3. Plant Family Distribution (Top 4 + Others)
    const [familyData] = await pool.query(`
      SELECT family, COUNT(*) AS count 
      FROM herbarium_data 
      GROUP BY family 
      ORDER BY count DESC 
      LIMIT 4
    `);

    // 4. Top Contributors
    const [topContributors] = await pool.query(`
      SELECT 
        u.name, 
        u.institution,
        COUNT(bs.id) AS submissions,
        ROUND((SUM(CASE WHEN bs.status = 'approved' THEN 1 ELSE 0 END) / COUNT(bs.id)) * 100) AS acceptanceRate
      FROM users u
      JOIN botanist_submissions bs ON u.id = bs.botanist_id
      GROUP BY u.id
      ORDER BY submissions DESC
      LIMIT 5
    `);

    // 5. Pending Actions (Combines pending applications & plant submissions)
    const [pendingApplications] = await pool.query(`
      SELECT id, full_name AS title, 'Botanist Application' AS type, applied_at AS date 
      FROM botanist_applications WHERE status = 'pending' LIMIT 3
    `);

    const [pendingSubmissions] = await pool.query(`
      SELECT id, name AS title, 'Plant Submission' AS type, created_at AS date 
      FROM botanist_submissions WHERE status = 'pending' LIMIT 3
    `);

    const pendingActions = [...pendingApplications, ...pendingSubmissions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 4);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalBotanists,
          pendingApps,
          pendingSubs,
          approvedRecords,
          rejectedCount
        },
        trends,
        familyDistribution: familyData,
        topContributors,
        pendingActions
      }
    });

  } catch (error) {
    console.error('❌ Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard metrics' });
  }
};

module.exports = { getDashboardStats };