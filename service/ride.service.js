const db = require("../db");

class RideService {
  async createRide(ride) {
    const {
      driver_id,
      departure_location,
      arrival_location,
      departure_date,
      available_seats,
      total_seats,
      price,
      additional_details,
    } = ride;
    const newRide = await db.query(
      `INSERT INTO ride (
          driver_id,
          departure_location,
          arrival_location,
          departure_date,
          available_seats,
          total_seats,
          price,
          additional_details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        driver_id,
        departure_location,
        arrival_location,
        departure_date,
        available_seats,
        total_seats,
        price,
        additional_details,
      ]
    );
    return newRide.rows[0];
  }

  async getAllRides() {
    const allRides = await db.query(`SELECT * from ride`);
    return allRides.rows;
  }
}

module.exports = new RideService();
