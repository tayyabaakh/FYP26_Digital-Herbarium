const express = require("express");
const router = express.Router();
const multer = require("multer");
const Groq = require("groq-sdk");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/ai/identify", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image provided." });
  }

  try {
    const base64Image = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    const prompt = `
You are a botanical metadata extraction model. Examine the herbarium specimen label image and extract all text and structured field details.

Return ONLY a JSON object where keys map directly to:
- "name": Full plant scientific name (e.g., "Mentha longifolia (L.) Huds.")
- "species": Species epithet (e.g., "longifolia")
- "family": Plant family (e.g., "Lamiaceae")
- "location_code": Location code or herbarium code (e.g., "G.H.No 96908" or "KHI-UOK-001")
- "collection_no": Collection or catalog number (e.g., "716")
- "habitat": Habitat or altitude notes (e.g., "Altitude 1890 m")
- "habit": Habit type (e.g., "Perennial herb")
- "flower_color": Color of flower (e.g., "White")
- "collector_name": Primary collector (e.g., "Maroof Shah")
- "collection_group_members": Any co-collectors or group members
- "collection_date": Date formatted as YYYY-MM-DD
- "locality": Collection locality (e.g., "Daral gunthard")
- "latitude": Latitude as string or number (e.g., "35.1382")
- "longitude": Longitude as string or number (e.g., "72.2936")

Rule: If a field is not found in the image, return empty string "".
`;

    const response = await groq.chat.completions.create({
      model: "qwen/qwen3.8-27b",
      response_format: { type: "json_object" },
      reasoning_format: "hidden",
      max_tokens: 600,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    const parsedData = JSON.parse(response.choices[0]?.message?.content || "{}");

    return res.status(200).json({
      success: true,
      extractedData: parsedData,
    });
  } catch (error) {
    console.error("AI processing error:", error);
    return res.status(500).json({ success: false, message: "Extraction failed." });
  }
});

module.exports = router;



// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const { GoogleGenAI } = require("@google/genai");

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 20 * 1024 * 1024 },
// });

// // Initialize Gemini Client
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// /**
//  * Splits a botanical scientific name into Genus and Species epithet.
//  * Examples:
//  *  - "Mentha longifolia (L.) Huds." -> name: "Mentha", species: "longifolia"
//  *  - "Mentha"                       -> name: "Mentha", species: ""
//  */
// const parseTaxonomyName = (rawName) => {
//   if (!rawName) return { name: "", species: "" };

//   const clean = rawName.trim();
//   const parts = clean.split(/\s+/);

//   if (parts.length === 1) {
//     return { name: clean, species: "" };
//   }

//   // First word is Genus (name), second word is species epithet
//   return {
//     name: parts[0],
//     species: parts[1]
//   };
// };

// router.post("/ai/identify", upload.single("image"), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ success: false, message: "No image provided." });
//   }

//   try {
//     const prompt = `
// You are an expert botanical herbarium OCR and metadata extraction model. 
// Examine the handwritten and printed text on this specimen label carefully.

// Extract structured details and return ONLY a JSON object with these keys:
// - "raw_scientific_name": Full plant scientific name including authorities if visible (e.g., "Mentha longifolia (L.) Huds.")
// - "family": Plant family (e.g., "Lamiaceae" or "Labiatae")
// - "location_code": Herbarium code or sheet identifier (e.g., "22494" or "Herbarium P. C. S. I. R. Laboratories, PESHAWAR")
// - "collection_no": Field or collection number (e.g., "3763")
// - "habitat": Habitat or environmental notes
// - "habit": Habit type (e.g., "Herb", "Shrub")
// - "flower_color": Flower color
// - "collector_name": Primary collector (e.g., "S.M.A. Kazmi")
// - "collection_group_members": Any co-collectors
// - "collection_date": Date formatted as YYYY-MM-DD or raw string if incomplete (e.g., "1/9/72" -> "1972-09-01")
// - "locality": Collection locality (e.g., "Kurram Valley, Shalizan")
// - "latitude": Latitude if present
// - "longitude": Longitude if present

// Rule: If a field is missing or unreadable, return an empty string "".
// `;

//     // Convert image buffer to base64 inlineData format
//     const imagePart = {
//       inlineData: {
//         data: req.file.buffer.toString("base64"),
//         mimeType: req.file.mimetype,
//       },
//     };

//     // Call Gemini 2.5 Flash with structured JSON output enforcement
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [prompt, imagePart],
//       config: {
//         responseMimeType: "application/json",
//       },
//     });

//     const extracted = JSON.parse(response.text || "{}");

//     // Parse taxonomy name into Genus (name) and Species epithet
//     const { name, species } = parseTaxonomyName(extracted.raw_scientific_name);

//     const finalParsedData = {
//       name: name,                             // Genus only (matches database schema)
//       species: extracted.species || species,  // Species epithet
//       family: extracted.family || "",
//       location_code: extracted.location_code || "",
//       collection_no: extracted.collection_no || "",
//       habitat: extracted.habitat || "",
//       habit: extracted.habit || "",
//       flower_color: extracted.flower_color || "",
//       collector_name: extracted.collector_name || "",
//       collection_group_members: extracted.collection_group_members || "",
//       collection_date: extracted.collection_date || "",
//       locality: extracted.locality || "",
//       latitude: extracted.latitude || "",
//       longitude: extracted.longitude || "",
//     };

//     return res.status(200).json({
//       success: true,
//       extractedData: finalParsedData,
//     });
//   } catch (error) {
//     console.error("AI processing error:", error);
//     return res.status(500).json({ success: false, message: "Extraction failed." });
//   }
// });

// module.exports = router;