
// const fs = require("fs");
// const path = require("path");
// const XLSX = require("xlsx");
// const pool = require("../config/db");

// const BATCH_SIZE = 500;

// const EXCEL_FILE =
//   "Herbarium Data (Dr.Badar) merge Hamza &M.Naiz 29-6-26 (1).xlsx";

// const PREFERRED_SHEET = "Specimens";

// const COLUMNS = [
//   "location_code",
//   "specimen_id_gh_number",
//   "collection_no",
//   "name",
//   "species",
//   "family",
//   "habit",
//   "flower_color",
//   "habitat",
//   "locality",
//   "collector_group_members",
//   "collector_name",
//   "date",
//   "collection_folder",
//   "specimen_folder",
//   "image_url",
//   "latitude",
//   "longitude",
//   "author"
// ];

// function normalizeHeader(value) {
//   return String(value ?? "")
//     .normalize("NFKC")
//     .replace(/[\r\n\t]/g, " ")
//     .replace(/\s+/g, " ")
//     .replace(/[^a-zA-Z0-9]/g, "")
//     .toLowerCase();
// }

// function asText(value) {
//   return value == null ? "" : String(value).trim();
// }

// function hasValue(value) {
//   return asText(value) !== "";
// }

// function getField(row, ...aliases) {
//   for (const alias of aliases) {
//     const key = normalizeHeader(alias);

//     if (
//       Object.prototype.hasOwnProperty.call(row, key) &&
//       row[key] !== null &&
//       row[key] !== undefined
//     ) {
//       return row[key];
//     }
//   }

//   return "";
// }

// function getSpecimenId(row) {
//   return getField(
//     row,
//     "Specimen ID/GH Number",
//     "Specimen ID / GH Number",
//     "Specimen ID",
//     "GH Number",
//     "specimen_id_gh_number"
//   );
// }

// function parseCoordinate(value) {
//   if (!hasValue(value)) return null;

//   const number = Number(value);
//   return Number.isFinite(number) ? number : null;
// }

// function getHeaderRow(sheet) {
//   const rows = XLSX.utils.sheet_to_json(sheet, {
//     header: 1,
//     defval: "",
//     raw: false,
//     blankrows: false
//   });

//   const headerIndex = rows.findIndex((row) =>
//     row.some((cell) => {
//       const header = normalizeHeader(cell);
//       return (
//         header.includes("specimenid") ||
//         header.includes("ghnumber")
//       );
//     })
//   );

//   return {
//     rows,
//     headerIndex,
//     headers:
//       headerIndex < 0
//         ? []
//         : rows[headerIndex].map(asText)
//   };
// }

// function rowsToObjects(headers, rows) {
//   return rows.map((values) => {
//     const result = {};

//     headers.forEach((header, index) => {
//       const key = normalizeHeader(header);
//       if (key) result[key] = values[index] ?? "";
//     });

//     return result;
//   });
// }

// function mapRecord(row) {
//   const rawId = asText(getSpecimenId(row));

//   // Reject missing, nonnumeric, unsafe, or out-of-range IDs.
//   if (!/^\d+$/.test(rawId)) return null;

//   const id = Number(rawId);

//   if (!Number.isSafeInteger(id) || id > 2147483647) {
//     return null;
//   }

//   return {
//     location_code: asText(
//       getField(row, "Location Code", "location_code")
//     ),
//     specimen_id_gh_number: id,
//     collection_no: asText(
//       getField(row, "Collection Number", "Collection No", "collection_no")
//     ),
//     name: asText(getField(row, "Genus", "name")),
//     species: asText(getField(row, "Species", "species")),
//     family: asText(getField(row, "Family", "family")).toUpperCase(),
//     habit: asText(getField(row, "Habit", "habit")),
//     flower_color: asText(
//       getField(row, "Flower color", "Flower Colour", "flower_color")
//     ),
//     habitat: asText(getField(row, "Habitat", "habitat")),
//     locality: asText(getField(row, "Locality", "locality")),
//     collector_group_members: asText(
//       getField(
//         row,
//         "Collector Group Members",
//         "Collector Group",
//         "collector_group_members"
//       )
//     ),
//     collector_name: asText(
//       getField(
//         row,
//         "Collector's Name",
//         "Collecto's Name",
//         "Collector Name",
//         "Collector",
//         "collector_name"
//       )
//     ),
//     date: asText(getField(row, "Date", "Collection Date", "date")),
//     collection_folder: asText(
//       getField(row, "Collection Folder", "collection_folder")
//     ),
//     specimen_folder: asText(
//       getField(
//         row,
//         "Folder",
//         "Specimen Folder",
//         "File Path",
//         "specimen_folder"
//       )
//     ),
//     image_url: asText(getField(row, "Image URL", "image_url")),
//     latitude: parseCoordinate(
//       getField(row, "Latitude", "latitude")
//     ),
//     longitude: parseCoordinate(
//       getField(row, "Longitude", "longitude")
//     ),
//     author: asText(
//       getField(row, "Author citation", "Author", "author")
//     )
//   };
// }

// function toSqlValues(record) {
//   return COLUMNS.map((column) => {
//     const value = record[column];

//     if (column === "specimen_id_gh_number") return value;

//     // Store empty text fields as NULL.
//     if (typeof value === "string" && value === "") return null;

//     return value ?? null;
//   });
// }

// function escapeLike(value) {
//   return value.replace(/[\\%_]/g, "\\$&");
// }

// async function importExcelData() {
//   let connection;

//   try {
//     const sourcePath = path.join(__dirname, EXCEL_FILE);

//     if (!fs.existsSync(sourcePath)) {
//       throw new Error(`Excel file not found: ${sourcePath}`);
//     }

//     console.log("Reading Excel file:", sourcePath);

//     const workbook = XLSX.readFile(sourcePath, {
//       cellDates: false
//     });

//     if (!workbook.SheetNames.includes(PREFERRED_SHEET)) {
//       throw new Error(
//         `Worksheet "${PREFERRED_SHEET}" not found.`
//       );
//     }

//     const sheet = workbook.Sheets[PREFERRED_SHEET];
//     const parsed = getHeaderRow(sheet);

//     if (parsed.headerIndex < 0) {
//       throw new Error("Specimen ID header not found.");
//     }

//     const dataRows = parsed.rows
//       .slice(parsed.headerIndex + 1)
//       .filter((row) => row.some(hasValue));

//     const rawData = rowsToObjects(parsed.headers, dataRows);

//     console.log("Parsed non-empty rows:", rawData.length);

//     const records = [];
//     const invalidRows = [];

//     rawData.forEach((row, index) => {
//       const record = mapRecord(row);

//       if (!record) {
//         invalidRows.push({
//           excelRow: parsed.headerIndex + index + 2,
//           specimenId: asText(getSpecimenId(row)),
//           reason: "Missing or invalid INT specimen ID"
//         });
//         return;
//       }

//       records.push(record);
//     });

//     console.log("Valid records:", records.length);
//     console.log("Invalid rows:", invalidRows.length);

//     const reportPath = path.join(
//       __dirname,
//       "import-invalid-rows.json"
//     );

//     fs.writeFileSync(
//       reportPath,
//       JSON.stringify(invalidRows, null, 2)
//     );

//     if (!records.length) {
//       throw new Error("No valid records to import.");
//     }

//     connection = await pool.getConnection();
//     await connection.ping();

//     console.log("Connected to TiDB.");

//     // Build a null-safe exact match across all 19 columns.
//     // Existing identical records are skipped; records with the same ID
//     // but different details are preserved.
//     const comparisons = COLUMNS.map(
//       (column) => `\`${column}\` <=> ?`
//     ).join(" AND ");

//     const findExisting = `
//       SELECT 1
//       FROM herbarium_data
//       WHERE ${comparisons}
//       LIMIT 1
//     `;

//     const insertQuery = `
//       INSERT INTO herbarium_data (
//         ${COLUMNS.map((column) => `\`${column}\``).join(", ")}
//       ) VALUES (${COLUMNS.map(() => "?").join(", ")})
//     `;

//     let inserted = 0;
//     let alreadyPresent = 0;
//     let failed = 0;
//     const failures = [];

//     for (let i = 0; i < records.length; i += BATCH_SIZE) {
//       const batch = records.slice(i, i + BATCH_SIZE);

//       for (const record of batch) {
//         try {
//           const values = toSqlValues(record);

//           const [existing] = await connection.execute(
//             findExisting,
//             values
//           );

//           if (existing.length > 0) {
//             alreadyPresent++;
//             continue;
//           }

//           await connection.execute(insertQuery, values);
//           inserted++;
//         } catch (error) {
//           failed++;

//           failures.push({
//             specimenId: record.specimen_id_gh_number,
//             collectionNo: record.collection_no,
//             name: record.name,
//             error: error.message
//           });

//           console.error(
//             "Failed record:",
//             record.specimen_id_gh_number,
//             record.name,
//             error.message
//           );
//         }
//       }

//       console.log(
//         `Processed ${Math.min(i + BATCH_SIZE, records.length)}` +
//         `/${records.length} | Inserted: ${inserted}` +
//         ` | Already present: ${alreadyPresent}` +
//         ` | Failed: ${failed}`
//       );
//     }

//     fs.writeFileSync(
//       path.join(__dirname, "import-failures.json"),
//       JSON.stringify(failures, null, 2)
//     );

//     const [countRows] = await connection.query(
//       "SELECT COUNT(*) AS total FROM herbarium_data"
//     );

//     console.log("\nImport finished.");
//     console.log("Inserted this run:", inserted);
//     console.log("Already present:", alreadyPresent);
//     console.log("Failed:", failed);
//     console.log("Invalid Excel rows:", invalidRows.length);
//     console.log("Current database total:", countRows[0].total);
//     console.log("Invalid-row report:", reportPath);
//     console.log(
//       "Failure report:",
//       path.join(__dirname, "import-failures.json")
//     );
//   } catch (error) {
//     console.error("Excel import failed:", error.message);
//     process.exitCode = 1;
//   } finally {
//     if (connection) connection.release();

//     if (typeof pool.end === "function") {
//       await pool.end();
//     }
//   }
// }

// importExcelData();



const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const pool = require("../config/db");

const BATCH_SIZE = 500;

const EXCEL_FILE =
  "Herbarium Data (Dr.Badar) merge Hamza &M.Naiz 29-6-26 (1).xlsx";

const PREFERRED_SHEET = "Specimens";

function normalizeHeader(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase();
}

function asText(value) {
  return value == null ? "" : String(value).trim();
}

function hasValue(value) {
  return asText(value) !== "";
}

function getField(row, ...aliases) {
  for (const alias of aliases) {
    const key = normalizeHeader(alias);

    if (
      Object.prototype.hasOwnProperty.call(row, key) &&
      row[key] !== null &&
      row[key] !== undefined
    ) {
      return row[key];
    }
  }

  return "";
}

function getSpecimenId(row) {
  return getField(
    row,
    "Specimen ID/GH Number",
    "Specimen ID / GH Number",
    "Specimen ID",
    "GH Number",
    "specimen_id_gh_number"
  );
}

function getHeaderRow(sheet) {
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: false
  });

  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => {
      const header = normalizeHeader(cell);
      return (
        header.includes("specimenid") ||
        header.includes("ghnumber")
      );
    })
  );

  return {
    rows,
    headerIndex,
    headers:
      headerIndex < 0
        ? []
        : rows[headerIndex].map(asText)
  };
}

function rowsToObjects(headers, rows) {
  return rows.map((values) => {
    const result = {};

    headers.forEach((header, index) => {
      const key = normalizeHeader(header);
      if (key) result[key] = values[index] ?? "";
    });

    return result;
  });
}

function extractCollectorRecord(row) {
  const rawId = asText(getSpecimenId(row));

  if (!/^\d+$/.test(rawId)) return null;

  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id > 2147483647) {
    return null;
  }

  // Fallback checks for Collector column names
  const collectorName = asText(
    getField(
      row,
      "Collector",
      "Collector's Name",
      "Collecto's Name",
      "Collector Name",
      "collector_name"
    )
  );

  return {
    specimen_id_gh_number: id,
    collector_name: collectorName !== "" ? collectorName : null
  };
}

async function updateCollectorNames() {
  let connection;

  try {
    const sourcePath = path.join(__dirname, EXCEL_FILE);

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Excel file not found: ${sourcePath}`);
    }

    console.log("Reading Excel file:", sourcePath);

    const workbook = XLSX.readFile(sourcePath, {
      cellDates: false
    });

    if (!workbook.SheetNames.includes(PREFERRED_SHEET)) {
      throw new Error(`Worksheet "${PREFERRED_SHEET}" not found.`);
    }

    const sheet = workbook.Sheets[PREFERRED_SHEET];
    const parsed = getHeaderRow(sheet);

    if (parsed.headerIndex < 0) {
      throw new Error("Specimen ID header not found.");
    }

    const dataRows = parsed.rows
      .slice(parsed.headerIndex + 1)
      .filter((row) => row.some(hasValue));

    const rawData = rowsToObjects(parsed.headers, dataRows);

    console.log("Parsed non-empty rows:", rawData.length);

    const recordsToUpdate = [];

    rawData.forEach((row) => {
      const record = extractCollectorRecord(row);

      // Only include records that have a valid ID and a non-null collector name
      if (record && record.collector_name !== null) {
        recordsToUpdate.push(record);
      }
    });

    console.log(`Found ${recordsToUpdate.length} records with collector names to update.`);

    if (!recordsToUpdate.length) {
      throw new Error("No valid collector records found to update.");
    }

    connection = await pool.getConnection();
    await connection.ping();

    console.log("Connected to TiDB.");

    // Query to update collector_name where it is currently NULL or empty
    const updateQuery = `
      UPDATE herbarium_data
      SET collector_name = ?
      WHERE specimen_id_gh_number = ?
        AND (collector_name IS NULL OR collector_name = '')
    `;

    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const failures = [];

    for (let i = 0; i < recordsToUpdate.length; i += BATCH_SIZE) {
      const batch = recordsToUpdate.slice(i, i + BATCH_SIZE);

      for (const record of batch) {
        try {
          const [result] = await connection.execute(updateQuery, [
            record.collector_name,
            record.specimen_id_gh_number
          ]);

          if (result.affectedRows > 0) {
            updatedCount++;
          } else {
            // Either already updated or specimen_id_gh_number didn't match
            skippedCount++;
          }
        } catch (error) {
          failedCount++;
          failures.push({
            specimenId: record.specimen_id_gh_number,
            collectorName: record.collector_name,
            error: error.message
          });
        }
      }

      console.log(
        `Processed ${Math.min(i + BATCH_SIZE, recordsToUpdate.length)}/${recordsToUpdate.length}` +
        ` | Updated: ${updatedCount}` +
        ` | Skipped/Already Set: ${skippedCount}` +
        ` | Failed: ${failedCount}`
      );
    }

    fs.writeFileSync(
      path.join(__dirname, "update-collector-failures.json"),
      JSON.stringify(failures, null, 2)
    );

    console.log("\nUpdate process finished.");
    console.log("Successfully updated rows:", updatedCount);
    console.log("Skipped (already had values or ID not found):", skippedCount);
    console.log("Failed:", failedCount);
  } catch (error) {
    console.error("Update failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (connection) connection.release();

    if (typeof pool.end === "function") {
      await pool.end();
    }
  }
}

updateCollectorNames();