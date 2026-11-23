const db = require('../config/db'); // Adjust path to your db config

async function cleanDates() {
    try {
        console.log("Fetching herbarium records...");
        const [rows] = await db.query("SELECT specimen_id_gh_number, date FROM herbarium_data WHERE date IS NOT NULL AND date != ''");
        
        console.log(`Processing ${rows.length} records...`);
        let updatedCount = 0;

        for (const row of rows) {
            let original = row.date.trim();
            let cleaned = original;

            // 1. Remove surrounding dots or weird punctuation (e.g., "..2004" or ".2007.")
            cleaned = cleaned.replace(/^\.+|\.+$/g, '');

            // 2. Replace dots used as separators with slashes (e.g., "1.7.2025" -> "1/7/2025")
            cleaned = cleaned.replace(/\./g, '/');

            // 3. Handle MM/DD/YY or M/D/YY formats (ending with 2-digit years)
            const parts = cleaned.split('/');
            if (parts.length === 3) {
                let month = parts[0];
                let day = parts[1];
                let year = parts[2];

                if (year.length === 2) {
                    const yy = parseInt(year, 10);
                    // Pivot year logic: 00-29 is 2000s, 30-99 is 1900s
                    const fullYear = yy <= 29 ? `20${year}` : `19${year}`;
                    cleaned = `${month}/${day}/${fullYear}`;
                }
            }

            // Only update if the date string changed
            if (cleaned !== original) {
                await db.query(
                    "UPDATE herbarium_data SET date = ? WHERE specimen_id_gh_number = ?",
                    [cleaned, row.specimen_id_gh_number]
                );
                updatedCount++;
            }
        }

        console.log(`Successfully cleaned and updated ${updatedCount} date records!`);
        process.exit(0);
    } catch (err) {
        console.error("Error cleaning dates:", err);
        process.exit(1);
    }
}

cleanDates();