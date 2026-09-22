const db = require("../config/db");

/**
 * GET /api/botanist/dashboard
 *
 * Returns all dashboard information for
 * the currently authenticated botanist.
 */
const getBotanistDashboard = async (req, res) => {
    try {
        // Get authenticated user's ID from JWT
        const botanistId = req.user.userId;

        // --------------------------------------------------
        // 1. Get botanist information
        // --------------------------------------------------

        const [users] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                phone,
                institution,
                qualification,
                specialisation,
                experience_years,
                portfolio_url
            FROM users
            WHERE id = ?
              AND role = 'botanist'
              AND is_active = 1
            `,
            [botanistId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Botanist not found"
            });
        }

        const user = users[0];

        // --------------------------------------------------
        // 2. Dashboard statistics
        // --------------------------------------------------

        const [statsResult] = await db.query(
            `
            SELECT
                COUNT(*) AS totalSubmissions,

                SUM(
                    CASE
                        WHEN status = 'approved'
                        THEN 1
                        ELSE 0
                    END
                ) AS approved,

                SUM(
                    CASE
                        WHEN status = 'pending'
                        THEN 1
                        ELSE 0
                    END
                ) AS pending,

                SUM(
                    CASE
                        WHEN status = 'rejected'
                        THEN 1
                        ELSE 0
                    END
                ) AS rejected

            FROM botanist_submissions
            WHERE botanist_id = ?
            `,
            [botanistId]
        );

        const stats = {
            totalSubmissions: Number(
                statsResult[0].totalSubmissions || 0
            ),

            approved: Number(
                statsResult[0].approved || 0
            ),

            pending: Number(
                statsResult[0].pending || 0
            ),

            rejected: Number(
                statsResult[0].rejected || 0
            )
        };

        // --------------------------------------------------
        // 3. Recent activity
        // --------------------------------------------------

        const [recentActivity] = await db.query(
            `
            SELECT
                id,
                name,
                family,
                species,
                collection_date,
                status,
                created_at
            FROM botanist_submissions
            WHERE botanist_id = ?
            ORDER BY created_at DESC
            LIMIT 5
            `,
            [botanistId]
        );

        // --------------------------------------------------
        // 4. Monthly contribution
        // --------------------------------------------------

        const [monthlyContribution] = await db.query(
            `
            SELECT
                DATE_FORMAT(created_at, '%Y-%m') AS month,
                COUNT(*) AS submitted,

                SUM(
                    CASE
                        WHEN status = 'approved'
                        THEN 1
                        ELSE 0
                    END
                ) AS approved

            FROM botanist_submissions

            WHERE botanist_id = ?

            AND created_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 6 MONTH
            )

            GROUP BY DATE_FORMAT(created_at, '%Y-%m')

            ORDER BY month ASC
            `,
            [botanistId]
        );

        // --------------------------------------------------
        // 5. Weekly submission trend
        // --------------------------------------------------

        const [submissionTrend] = await db.query(
            `
            SELECT
                YEARWEEK(created_at, 1) AS week,
                COUNT(*) AS submissions

            FROM botanist_submissions

            WHERE botanist_id = ?

            AND created_at >= DATE_SUB(
                CURDATE(),
                INTERVAL 8 WEEK
            )

            GROUP BY YEARWEEK(created_at, 1)

            ORDER BY week ASC
            `,
            [botanistId]
        );

        // --------------------------------------------------
        // 6. AI statistics
        // --------------------------------------------------

        const [aiResult] = await db.query(
            `
            SELECT
                COUNT(
                    CASE
                        WHEN ai_identified = 1
                        THEN 1
                    END
                ) AS aiSubmissions,

                AVG(
                    CASE
                        WHEN ai_identified = 1
                        THEN ai_confidence
                    END
                ) AS averageConfidence

            FROM botanist_submissions

            WHERE botanist_id = ?
            `,
            [botanistId]
        );

        const aiStats = {
            aiSubmissions: Number(
                aiResult[0].aiSubmissions || 0
            ),

            averageConfidence: aiResult[0].averageConfidence
                ? Number(aiResult[0].averageConfidence)
                : 0
        };

        // --------------------------------------------------
        // 7. Send response
        // --------------------------------------------------

        return res.status(200).json({
            success: true,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                institution: user.institution,
                qualification: user.qualification,
                specialisation: user.specialisation,
                experienceYears: user.experience_years,
                portfolioUrl: user.portfolio_url
            },

            stats,

            recentActivity,

            monthlyContribution,

            submissionTrend,

            aiStats
        });

    } catch (error) {

        console.error(
            "❌ Error fetching botanist dashboard:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
};

module.exports = {
    getBotanistDashboard
};