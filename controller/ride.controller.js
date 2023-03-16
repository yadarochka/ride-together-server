const db = require("../db");
const RideService = require("../service/ride.service");

class RideController {
  createRide(req, res) {
    try {
      const ride = req.body;
      const newRide = RideService.createRide(ride);
      res.json(newRide);
    } catch (error) {
      res.send(error.message);
    }
  }

  getAllRides(req, res) {
    const allRides = RideService.getAllRides();
    res.json(allRides.rows);
  }

  async getRideById(req, res) {
    const id = req.params.id;
    const ride = await db.query(`SELECT * from ride WHERE id = ${id}`);
    res.json(ride.rows[0]);
  }

  async getRidesByDriverId(req, res) {
    const driver_id = req.params.driver_id;
    const rides = await db.query(
      `SELECT * from ride WHERE driver_id = ${driver_id}`
    );
    res.json(rides.rows);
  }

  async getRidesByCoordinates(req, res) {
    const { lat, lng } = req.query;
    console.log(lat, lng);
    const query =
      "SELECT * FROM ride WHERE ST_Distance_Sphere(departure_location, ST_MakePoint($1, $2)) < 10000";
    const values = [lng, lat];
    const { rows } = await db.query(query, values);
    res.json(rows);
  }

  async updateRide(req, res) {
    const id = req.params.id;
    const {
      departure_location,
      arrival_location,
      departure_date,
      available_seats,
      total_seats,
      price,
      additional_details,
    } = req.body;

    const updatedRide = await db.query(
      `UPDATE ride SET 
      departure_location = $1, 
      arrival_location = $2, 
      departure_date = $3, 
      available_seats = $4, 
      total_seats = $5, 
      price = $6,
      additional_details = $7
      WHERE id = ${id} RETURNING *`,
      [
        departure_location,
        arrival_location,
        departure_date,
        available_seats,
        total_seats,
        price,
        additional_details,
      ]
    );
    res.json(updatedRide.rows[0]);
  }

  async deleteRide(req, res) {
    const id = req.params.id;
    await db.query(`DELETE FROM ride WHERE id = ${id}`);
    res.status(204).send("Поездка удалена!");
  }

  async addPassengerToRide(req, res) {
    try {
      const { ride_id, user_id } = req.body;
      const query = `
      BEGIN;
      SELECT available_seats FROM ride WHERE id = ${ride_id} FOR UPDATE;
      UPDATE ride SET available_seats = available_seats - 1 WHERE id = ${ride_id} AND available_seats > 0;
      DO $$
          BEGIN
              IF (SELECT driver_id FROM ride WHERE id = ${ride_id}) = ${user_id} THEN
                  RAISE EXCEPTION 'Нельзя добавить водителя в качестве пассажира';
              ELSE
                  INSERT INTO user_ride (ride_id, user_id) VALUES (${ride_id}, ${user_id});
              END IF;
          END;
      $$;
      COMMIT;
      `;
      await db.query(query);
      res.send("Пассажир добавлен в поездку");
    } catch (err) {
      const { ride_id, user_id } = req.body;
      const query = `ROLLBACK`;
      await db.query(query);
      res.send(err.message);
    }
  }
}

module.exports = new RideController();
