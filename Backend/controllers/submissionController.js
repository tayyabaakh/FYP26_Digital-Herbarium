
const db = require('../config/db');
const cloudinary = require('../config/cloudinary');


const parseTaxonomyName = (inputName) => {
  if (!inputName) return { genus: null, species: null };

  const clean = inputName.trim();
  const parts = clean.split(/\s+/);

  if (parts.length === 1) {
    return { genus: clean, species: null };
  }

  // The last word or second word is the species epithet, preceding part is genus
  const species = parts[parts.length - 1];
  const genus = parts.slice(0, parts.length - 1).join(" ");

  return { genus, species };
};
// =====================================================
// CREATE SUBMISSION
// =====================================================

const createSubmission = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (req.user.role !== "botanist") {
            return res.status(403).json({
                success: false,
                message: "Only botanists can create submissions."
            });
        }

        const botanist_id = req.user.userId;

        const {
            name, // Input string e.g., "Halogeton glomeratus"
            family,
            location_code,
            collection_no,
            habitat,
            habit,
            flower_color,
            collector_name,
            collection_group_members,
            collection_date,
            locality,
            latitude,
            longitude
        } = req.body;

        // Validation
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Plant scientific name is required'
            });
        }

        if (!family) {
            return res.status(400).json({
                success: false,
                message: 'Family is required'
            });
        }

        // Parse Genus (for 'name' column) and Specific Epithet (for 'species' column)
        const { genus, species } = parseTaxonomyName(name);

        // Upload image to Cloudinary
        let imageUrl = null;
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "flora-digitalis/specimens",
                        resource_type: "image"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }

        // Insert submission into DB
        const query = `
            INSERT INTO botanist_submissions
            (
                botanist_id,
                name,
                family,
                species,
                location_code,
                collection_no,
                habitat,
                habit,
                flower_color,
                collector_name,
                collection_group_members,
                collection_date,
                locality,
                latitude,
                longitude,
                ai_identified,
                ai_confidence,
                image_url,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            botanist_id,
            genus,    // Saved as Genus only
            family.trim(),
            species,  // Saved as Species epithet
            location_code || null,
            collection_no || null,
            habitat || null,
            habit || null,
            flower_color || null,
            collector_name || null,
            collection_group_members || null,
            collection_date || null,
            locality || null,
            latitude || null,
            longitude || null,
            false,
            null,
            imageUrl,
            'pending'
        ];

        const [result] = await db.query(query, values);

        return res.status(201).json({
            success: true,
            message: 'Botanist submission created successfully',
            submissionId: result.insertId,
            imageUrl: imageUrl
        });

    } catch (error) {
        console.error('Create Submission Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create submission',
            error: error.message
        });
    }
};


// =====================================================
// SAVE DRAFT
// =====================================================

const saveDraft = async (req, res) => {
    try {

        // ---------------------------------------------
        // Authentication check
        // ---------------------------------------------

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }


        // ---------------------------------------------
        // Only botanists can save drafts
        // ---------------------------------------------

        if (req.user.role !== "botanist") {
            return res.status(403).json({
                success: false,
                message: "Only botanists can save drafts."
            });
        }


        // ---------------------------------------------
        // Get authenticated botanist ID
        // ---------------------------------------------

        const botanist_id = req.user.userId;


        // ---------------------------------------------
        // Get form data
        // ---------------------------------------------

        const {
            name,
            family,
            location_code,
            collection_no,
            habitat,
            habit,
            flower_color,
            collector_name,
            collection_group_members,
            collection_date,
            locality,
            latitude,
            longitude
        } = req.body;

// Parse species if name exists
        const parsedSpecies = parseSpeciesFromName(name);
        // ---------------------------------------------
        // Upload image to Cloudinary if provided
        // ---------------------------------------------

        let imageUrl = null;

        if (req.file) {

            const result = await new Promise((resolve, reject) => {

                const uploadStream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "flora-digitalis/specimens/drafts",
                            resource_type: "image"
                        },
                        (error, result) => {

                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }

                        }
                    );

                uploadStream.end(req.file.buffer);
            });

            imageUrl = result.secure_url;
        }


        // ---------------------------------------------
        // Insert draft into TiDB
        // ---------------------------------------------

        const query = `
            INSERT INTO botanist_submissions
            (
                botanist_id,
                name,
                family,
                species,
                location_code,
                collection_no,
                habitat,
                habit,
                flower_color,
                collector_name,
                collection_group_members,
                collection_date,
                locality,
                latitude,
                longitude,
                ai_identified,
                ai_confidence,
                image_url,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        const values = [
            botanist_id,
            name || null,
            family || null,
            parsedSpecies,
            location_code || null,
            collection_no || null,
            habitat || null,
            habit || null,
            flower_color || null,
            collector_name || null,
            collection_group_members || null,
            collection_date || null,
            locality || null,
            latitude || null,
            longitude || null,

            // AI fields
            false,
            null,

            // Cloudinary image URL
            imageUrl,

            // Draft status
            'draft'
        ];


        const [result] = await db.query(query, values);


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        return res.status(201).json({
            success: true,
            message: 'Draft saved successfully',
            draftId: result.insertId,
            imageUrl: imageUrl
        });


    } catch (error) {

        console.error('Save Draft Error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to save draft',
            error: error.message
        });
    }
};

const getMySubmissions = async (req, res) => {
    try {

        // ---------------------------------------------
        // Authentication check
        // ---------------------------------------------

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        // ---------------------------------------------
        // Only botanists
        // ---------------------------------------------

        if (req.user.role !== "botanist") {
            return res.status(403).json({
                success: false,
                message: "Only botanists can view their submissions."
            });
        }

        // ---------------------------------------------
        // Get logged-in botanist
        // ---------------------------------------------

        const botanist_id = req.user.userId;

        // ---------------------------------------------
        // Fetch submissions
        // ---------------------------------------------

        const query = `
            SELECT
                id,
                name,
                family,
                species,
                collection_date,
                locality,
                status,
                image_url,
                created_at
            FROM botanist_submissions
            WHERE botanist_id = ?
            ORDER BY created_at DESC
        `;

        const [rows] = await db.query(query, [botanist_id]);

        return res.status(200).json({
            success: true,
            submissions: rows
        });

    } catch (error) {

        console.error("Get My Submissions Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
            error: error.message
        });
    }
};


// =====================================================
// GET ALL SUBMISSIONS FOR ADMIN REVIEW
// =====================================================
const getAllSubmissionsForAdmin = async (req, res) => {
    try {
        // Authentication check
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        // Role check (Admin only)
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const { status = 'pending' } = req.query; // Default filter to pending

        const query = `
            SELECT 
                bs.*,
                u.name AS botanist_name,
                u.email AS botanist_email
            FROM botanist_submissions bs
            LEFT JOIN users u ON bs.botanist_id = u.id
            WHERE bs.status = ?
            ORDER BY bs.created_at ASC
        `;

        const [submissions] = await db.query(query, [status]);

        return res.status(200).json({
            success: true,
            count: submissions.length,
            submissions
        });

    } catch (error) {
        console.error("Get All Submissions Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch submissions for admin review.",
            error: error.message
        });
    }
};

const approveSubmission = async (req, res) => {
    const connection = await db.getConnection();

    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const { id } = req.params;

        await connection.beginTransaction();

        // 1. Fetch submission record
        const [submissions] = await connection.query(
            `SELECT * FROM botanist_submissions WHERE id = ? FOR UPDATE`,
            [id]
        );

        if (submissions.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: "Submission not found."
            });
        }

        const submission = submissions[0];

        if (submission.status === "approved") {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: "Submission has already been approved."
            });
        }

        // 2. Updated INSERT statement mapping botanist_submissions.id -> specimen_id_gh_number
        const insertHerbariumQuery = `
            INSERT INTO herbarium_data (
                specimen_id_gh_number,
                name,
                family,
                species,
                location_code,
                collection_no,
                habitat,
                habit,
                flower_color,
                collector_name,
                collector_group_members,
                date,
                locality,
                latitude,
                longitude,
                image_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const herbariumValues = [
            submission.id ? String(submission.id) : null, // Mapped to specimen_id_gh_number
            submission.name || null,
            submission.family || null,
            submission.species || null,
            submission.location_code || null,
            submission.collection_no || null,
            submission.habitat || null,
            submission.habit || null,
            submission.flower_color || null,
            submission.collector_name || null,
            submission.collection_group_members || submission.collector_group_members || null,
            submission.collection_date || submission.date || null,
            submission.locality || null,
            submission.latitude || null,
            submission.longitude || null,
            submission.image_url || submission.image || null
        ];

        const [insertResult] = await connection.query(insertHerbariumQuery, herbariumValues);

        // 3. Update botanist_submissions status
        await connection.query(
            `UPDATE botanist_submissions 
             SET status = 'approved', 
                 reviewed_by = ?, 
                 reviewed_at = NOW() 
             WHERE id = ?`,
            [req.user.userId || req.user.id, id]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Submission approved and successfully transferred to herbarium data.",
            herbariumId: insertResult.insertId
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Approve Submission Error:", error);
        return res.status(500).json({
            success: false,
            message: error.sqlMessage || error.message || "Failed to approve submission."
        });
    } 
    finally {
        if (connection) connection.release();
    }
};

// =====================================================
// REJECT SUBMISSION
// =====================================================
const rejectSubmission = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        const { id } = req.params;

        const [result] = await db.query(
            `UPDATE botanist_submissions SET status = 'rejected' WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Submission not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Submission rejected."
        });

    } catch (error) {
        console.error("Reject Submission Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reject submission.",
            error: error.message
        });
    }
};


module.exports = {
    createSubmission,
    saveDraft,
    getMySubmissions,
    getAllSubmissionsForAdmin,
    approveSubmission,
    rejectSubmission

};