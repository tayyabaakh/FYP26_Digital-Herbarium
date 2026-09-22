const db = require("../config/db");

const getHerbariumRecords = async (req, res) => {
    try {
        const {
            search = "",
            family = "",
            scientificName = "",
            page = 1,
            limit = 10
        } = req.query;

        // Parse pagination parameters strictly as Integers for MySQL bindings
        const parsedPage = Math.max(1, parseInt(page, 10) || 1);
        const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
        const offset = (parsedPage - 1) * parsedLimit;

        const whereConditions = [];
        const queryParams = [];

        // Search filter matching `herbarium_data`
        if (search && search.trim() !== "") {
            whereConditions.push(
                `(specimen_id_gh_number LIKE ? OR name LIKE ? OR species LIKE ? OR family LIKE ?)`
            );
            const searchTerm = `%${search.trim()}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        // Family dropdown filter
        if (family && family.trim() !== "") {
            whereConditions.push(`family = ?`);
            queryParams.push(family.trim());
        }

        // Scientific name dropdown filter
        if (scientificName && scientificName.trim() !== "") {
            whereConditions.push(`name = ?`);
            queryParams.push(scientificName.trim());
        }

        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(" AND ")}`
            : "";

        // 1. Get total record count
        const countQuery = `SELECT COUNT(*) AS total FROM herbarium_data ${whereClause}`;
        const [countResult] = await db.query(countQuery, queryParams);
        const totalRecords = countResult[0]?.total || 0;

        // 2. Fetch records safely without breaking missing column definitions
        const dataQuery = `
            SELECT 
                COALESCE(specimen_id_gh_number, 'N/A') AS recordID,
                specimen_id_gh_number,
                name AS scientificName,
                species,
                family,
                collector_name AS collectorName,
                date AS collectionDate,
                locality,
                image_url AS imageUrl
            FROM herbarium_data
            ${whereClause}
            ORDER BY specimen_id_gh_number DESC
            LIMIT ? OFFSET ?
        `;

        const [records] = await db.query(dataQuery, [
            ...queryParams,
            parsedLimit,
            offset
        ]);

        // 3. Dropdown filter options
        const [familyRows] = await db.query(
            `SELECT DISTINCT family FROM herbarium_data WHERE family IS NOT NULL AND family != '' ORDER BY family ASC`
        );

        const [scientificNameRows] = await db.query(
            `SELECT DISTINCT name FROM herbarium_data WHERE name IS NOT NULL AND name != '' ORDER BY name ASC`
        );

        return res.status(200).json({
            records: records || [],
            pagination: {
                totalRecords,
                currentPage: parsedPage,
                totalPages: Math.ceil(totalRecords / parsedLimit) || 1,
                limit: parsedLimit
            },
            filters: {
                families: familyRows.map((r) => r.family),
                scientificNames: scientificNameRows.map((r) => r.name)
            }
        });
    } catch (error) {
        console.error("💥 Herbarium Controller Error:", error);
        return res.status(500).json({
            message: "Failed to retrieve herbarium records",
            error: error.message
        });
    }
};

module.exports = {
    getHerbariumRecords
};