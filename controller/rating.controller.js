const db = require("../db");

class RatingController {
  async addUserRating(req, res) {
    const { ride_id, from_user_id, to_user_id, value } = req.body;
    const rating = await db.query(
      `INSERT INTO rating (ride_id, from_user_id, to_user_id, value) VALUES ($1, $2, $3, $4) RETURNING *`,
      [ride_id, from_user_id, to_user_id, value]
    );
    res.json(rating.rows[0]);
  }

  async getRatingByUserId(req, res) {
    const id = req.params.id;
    const avgRating = await db.query(
      `SELECT AVG(value), COUNT(value)
      FROM rating
      WHERE to_user_id = ${id}`
    );
    res.json(avgRating.rows[0]);
  }

  async getRatingUsersByRideId(req, res) {
    const { ride_id, from_user_id } = req.query;
    const rating = (
      await db.query(
        "SELECT to_user_id, value FROM rating WHERE ride_id = $1 AND from_user_id = $2",
        [ride_id, from_user_id]
      )
    ).rows;
    res.json(rating);
  }
}

module.exports = new RatingController();
