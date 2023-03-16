const db = require("../db");

class RatingController {
  async getAllRating(req, res) {
    const rating = await db.query(`SELECT * FROM rating`);
    res.json(rating.rows);
  }

  //   async getRatingUserById(req, res) {
  //     const id = req.params.id;
  //     const rating = await db.query(`SELECT * FROM rating WHERE = ${id}`);
  //     res.json(rating.rows[0]);
  //   }

  async addUserRating(req, res) {
    const { from_user_id, to_user_id, value } = req.body;
    const rating = await db.query(
      `INSERT INTO rating (from_user_id, to_user_id, value) VALUES ($1, $2, $3) RETURNING *`,
      [from_user_id, to_user_id, value]
    );
    res.json(rating.rows[0]);
  }

  async getAverageRating(req, res) {
    const id = req.params.id;
    const avgRating = await db.query(
      `SELECT AVG(value), COUNT(value)
      FROM rating
      WHERE to_user_id = ${id}`
    );
    res.json(avgRating.rows[0]);
  }
}

module.exports = new RatingController();
