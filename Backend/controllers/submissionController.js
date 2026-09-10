// const db = require("../config/db");
// const fs = require("fs");


// // =====================================================
// // CREATE SUBMISSION
// // =====================================================

// exports.createSubmission = async (req, res) => {

//     const connection = await db.getConnection();

//     try {

//         const {
//             scientificName,
//             commonName,
//             family,
//             genus,
//             species,
//             province,
//             habitat,
//             collectorName,
//             collectionDate,
//             latitude,
//             longitude,
//             description,
//             status
//         } = req.body;


//         // ---------------------------------------------
//         // Validate user
//         // ---------------------------------------------

//         if (!req.user) {

//             return res.status(401).json({
//                 success: false,
//                 message: "Authentication required."
//             });

//         }


//         // ---------------------------------------------
//         // Only botanists
//         // ---------------------------------------------

//         if (req.user.role !== "botanist") {

//             return res.status(403).json({
//                 success: false,
//                 message: "Only botanists can create submissions."
//             });

//         }


//         // ---------------------------------------------
//         // Determine status
//         // ---------------------------------------------

//         const submissionStatus =
//             status === "pending"
//                 ? "pending"
//                 : "draft";


//         // ---------------------------------------------
//         // Start transaction
//         // ---------------------------------------------

//         await connection.beginTransaction();


//         // ---------------------------------------------
//         // Insert submission
//         // ---------------------------------------------

//         const [result] = await connection.query(

//             `
//             INSERT INTO botanist_submissions
//             (
//                 botanist_id,
//                 scientific_name,
//                 common_name,
//                 family,
//                 genus,
//                 species,
//                 province,
//                 habitat,
//                 collector_name,
//                 collection_date,
//                 latitude,
//                 longitude,
//                 description,
//                 status
//             )
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `,

//             [
//                 req.user.userId,
//                 scientificName || null,
//                 commonName || null,
//                 family || null,
//                 genus || null,
//                 species || null,
//                 province || null,
//                 habitat || null,
//                 collectorName || null,
//                 collectionDate || null,
//                 latitude || null,
//                 longitude || null,
//                 description || null,
//                 submissionStatus
//             ]

//         );


//         const submissionId = result.insertId;


//         // ---------------------------------------------
//         // Save uploaded images
//         // ---------------------------------------------

//         if (req.files && req.files.length > 0) {

//             for (const file of req.files) {

//                 await connection.query(

//                     `
//                     INSERT INTO submission_images
//                     (
//                         submission_id,
//                         file_name,
//                         file_path,
//                         mime_type,
//                         file_size
//                     )
//                     VALUES (?, ?, ?, ?, ?)
//                     `,

//                     [
//                         submissionId,
//                         file.filename,
//                         `/uploads/submissions/${file.filename}`,
//                         file.mimetype,
//                         file.size
//                     ]

//                 );

//             }

//         }


//         // ---------------------------------------------
//         // Commit transaction
//         // ---------------------------------------------

//         await connection.commit();


//         return res.status(201).json({

//             success: true,

//             message:
//                 submissionStatus === "pending"
//                     ? "Submission sent for review."
//                     : "Submission saved as draft.",

//             data: {
//                 submissionId,
//                 status: submissionStatus
//             }

//         });

//     } catch (error) {

//         await connection.rollback();

//         console.error(
//             "Create Submission Error:",
//             error
//         );

//         return res.status(500).json({
//             success: false,
//             message: "Failed to create submission."
//         });

//     } finally {

//         connection.release();

//     }

// };



const db = require('../config/db');

const createSubmission = async (req, res) => {
    try {
        const {
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
            longitude
        } = req.body;

        /*
         * IMPORTANT:
         * botanist_id should come from the authenticated user,
         * not from req.body.
         */
        const botanist_id = req.user.userId;

        
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
                message: "Only botanists can create submissions."
            });

        }


        // Required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Plant name is required'
            });
        }

        if (!family) {
            return res.status(400).json({
                success: false,
                message: 'Family is required'
            });
        }

        if (!species) {
            return res.status(400).json({
                success: false,
                message: 'Species is required'
            });
        }

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
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            botanist_id,
            name,
            family,
            species,
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

            // New submissions start as pending
            'pending'
        ];

        const [result] = await db.query(query, values);

        return res.status(201).json({
            success: true,
            message: 'Botanist submission created successfully',
            submissionId: result.insertId
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

const saveDraft = async (req, res) => {
    try {

        const {
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
            longitude
        } = req.body;

        // Get authenticated botanist
        const botanist_id = req.user.userId;

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
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            botanist_id,
            name || null,
            family || null,
            species || null,
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

            'draft'
        ];

        const [result] = await db.query(query, values);

        return res.status(201).json({
            success: true,
            message: 'Draft saved successfully',
            draftId: result.insertId
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

module.exports = {
    createSubmission,
    saveDraft
};