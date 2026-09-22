const db = require("../config/db");

// GET /api/profile/me
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [rows] = await db.execute(
            `
            SELECT
                id,
                name,
                email,
                role,
                is_active,
                phone,
                institution,
                qualification,
                specialisation,
                experience_years,
                portfolio_url,
                document_url,
                created_at
            FROM users
            WHERE id = ?
            LIMIT 1
            `,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = rows[0];

        // -----------------------------------------
        // Submission statistics
        // -----------------------------------------
        let totalSubmissions = 0;
        let acceptedRecords = 0;

        if (user.role === "botanist") {
            const [statsRows] = await db.execute(
                `
                SELECT
                    COUNT(*) AS totalSubmissions,
                    SUM(
                        CASE
                            WHEN status = 'accepted'
                            THEN 1
                            ELSE 0
                        END
                    ) AS acceptedRecords
                FROM botanist_submissions
                WHERE botanist_id = ?
                `,
                [userId]
            );

            totalSubmissions = Number(statsRows[0].totalSubmissions) || 0;
            acceptedRecords = Number(statsRows[0].acceptedRecords) || 0;
        }

        const acceptanceRate =
            totalSubmissions > 0
                ? Math.round((acceptedRecords / totalSubmissions) * 100)
                : 0;

        // -----------------------------------------
        // Years active (calculated from created_at)
        // -----------------------------------------
        let yearsActive = 0;

        if (user.created_at) {
            const createdAt = new Date(user.created_at);
            const today = new Date();

            yearsActive = today.getFullYear() - createdAt.getFullYear();
            const monthDifference = today.getMonth() - createdAt.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < createdAt.getDate())
            ) {
                yearsActive--;
            }

            if (yearsActive < 0) {
                yearsActive = 0;
            }
        }

        return res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: Boolean(user.is_active)
            },
            profile: {
                phone: user.phone,
                qualification: user.qualification,
                specialisation: user.specialisation,
                experienceYears: user.experience_years,
                institution: user.institution,
                portfolioUrl: user.portfolio_url,
                documentUrl: user.document_url
            },
            stats: {
                totalSubmissions,
                acceptedRecords,
                acceptanceRate,
                yearsActive
            }
        });

    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({
            message: "Failed to fetch profile"
        });
    }
};

// PUT /api/profile/me
const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            phone,
            qualification,
            specialisation,
            experienceYears,
            institution,
            portfolioUrl
        } = req.body;

        await db.execute(
            `
            UPDATE users
            SET
                phone = ?,
                qualification = ?,
                specialisation = ?,
                experience_years = ?,
                institution = ?,
                portfolio_url = ?
            WHERE id = ?
            `,
            [
                phone || null,
                qualification || null,
                specialisation || null,
                experienceYears || null,
                institution || null,
                portfolioUrl || null,
                userId
            ]
        );

        return res.status(200).json({
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: "Failed to update profile"
        });
    }
};

const updateMySettings = async (req, res) => {
    try {
        return res.status(200).json({
            message: "Settings updated successfully"
        });
    } catch (error) {
        console.error("Update settings error:", error);
        return res.status(500).json({
            message: "Failed to update settings"
        });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    updateMySettings
};