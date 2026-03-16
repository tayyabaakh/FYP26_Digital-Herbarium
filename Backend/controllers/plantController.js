const db = require('../config/db');

exports.getPlants = async (req, res) => {
  try {
    const { search, family } = req.query;
    let sql = "SELECT * FROM herbarium_data";
    let params = [];

    if (search) {
      sql += " WHERE name LIKE ? OR species LIKE ?";
      params = [`%${search}%`, `%${search}%`];
    }

    const [rows] = await db.execute(sql, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM herbarium_data WHERE specimen_id_gh_number = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Plant not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};