const pool = require('../../config/db');

exports.getUserResults = async (req, res) => {
  const { userId } = req.params;
  // try {
  //   const [results] = await pool.query('SELECT * FROM results WHERE user_id = ?', [userId]);
  //   res.status(200).json(results);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).json({ error: "Failed to retrieve user results" });
  // }
};