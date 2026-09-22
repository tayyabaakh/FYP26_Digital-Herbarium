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