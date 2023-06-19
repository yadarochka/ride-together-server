const db = require("../db");

class RideService {
  async createRide(
    driver_id,
    departure_location,
    arrival_location,
    departure_date,
    available_seats,
    total_seats,
    price,
    additional_details,
    status_id,
    departure_location_name,
    arrival_location_name
  ) {
    const newRide = await db.query(
      `INSERT INTO ride (
          driver_id,
          departure_location,
          arrival_location,
          departure_date,
          available_seats,
          total_seats,
          price,
          additional_details,
          status_id,
          departure_location_name,
          arrival_location_name) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        driver_id,
        departure_location,
        arrival_location,
        departure_date,
        available_seats,
        total_seats,
        price,
        additional_details,
        status_id,
        departure_location_name,
        arrival_location_name,
      ]
    );
    return newRide.rows[0];
  }

  async getAllRides() {
    const allRides = await db.query(`SELECT ride.*, users.name AS driver_name
    FROM ride
    JOIN users ON ride.driver_id = users.id
    WHERE departure_date > now() AND status_id = 1`);
    return allRides.rows;
  }

  async getRideById(rideId) {
    const ride =
      await db.query(`SELECT r.*, status_ride.name as status, users.name as driver_name, users.surname as driver_surname  FROM ride r JOIN status_ride ON r.status_id = status_ride.id JOIN users ON r.driver_id = users.id
     WHERE r.id = ${rideId}`);
    if (ride.rows[0]) {
      return { code: 200, ride: ride.rows[0] };
    }
    return { code: 404, ride: null };
  }

  async getRidesByDriverId(driver_id) {
    const rides = await db.query(
      `SELECT * from ride WHERE driver_id = ${driver_id}`
    );
    return rides.rows;
  }

  async getRidesByUserId(user_id) {
    const rides = await db.query(
      `(SELECT r.*, sr.name as status
        FROM ride r
        JOIN user_ride ur ON r.id = ur.ride_id
       JOIN status_ride sr ON r.status_id = sr.id
        WHERE ur.user_id = $1)
  UNION 
  (SELECT r.*, sr.name as status
      FROM ride r
       JOIN status_ride sr ON r.status_id = sr.id
      WHERE driver_id = $1
  )	  ORDER BY departure_date ASC`,
      [user_id]
    );
    return rides.rows;
  }

  async getPassengersByRideId(ride_id) {
    const passengers = await db.query(
      `SELECT u.id, u.name, u.surname
      FROM users u
      JOIN user_ride ur ON u.id = ur.user_id
      JOIN ride r ON r.id = ur.ride_id
      WHERE r.id = $1`,
      [ride_id]
    );
    return passengers.rows;
  }

  async getRidesByCoordinates(coordinates) {
    const { lng, lat } = coordinates;
    const query =
      "SELECT * FROM ride WHERE _Sphere(departure_locatiST_Distanceon, ST_MakePoint($1, $2)) < 10000";
    const values = [lng, lat];
    const rides = await db.query(query, values);
    return rides.rows;
  }

  async cancelRide(ride_id) {
    const cancelledRide = await db.query(
      `UPDATE ride SET 
      status_id = 3
      WHERE id = $1 RETURNING *`,
      [ride_id]
    );
    return cancelledRide.rows[0];
  }

  async deleteRide(id) {
    try {
      await db.query(`DELETE FROM ride WHERE id = ${id}`);
      return { code: 204, message: "Поездка удалена" };
    } catch (err) {
      return { code: 400, message: "Ошибка" };
    }
  }

  async addPassengerToRide(ride_id, user_id) {
    try {
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
      return { code: 200, message: "Пассажир добавлен в поездку" };
    } catch (err) {
      const query = `ROLLBACK`;
      await db.query(query);
      return { code: 500, message: err.message };
    }
  }

  async deletePassengerFromRide(ride_id, user_id) {
    try {
      const query = `BEGIN; DELETE FROM user_ride WHERE ride_id = ${ride_id} AND user_id = ${user_id}; UPDATE ride SET available_seats = available_seats + 1 WHERE id = ${ride_id}; COMMIT;`;
      await db.query(query);
      return { code: 200, message: "Пассажир удален из поездки" };
    } catch (err) {
      const query = ROLLBACK;
      await db.query(query);
      return { code: 500, message: err.message };
    }
  }

  async getRidesWithFilters({
    maxPrice,
    minPrice,
    maxSeats,
    minSeats,
    departure_location,
    arrival_location,
    minRadius,
    maxRadius,
    date,
  }) {
    try {
      const response = await db.query(
        `SELECT ride.*, users.name AS driver_name
      FROM ride
      JOIN users ON ride.driver_id = users.id 
      WHERE pg_catalog.date_trunc('day', departure_date::date) = pg_catalog.date_trunc('day', $11::date)
      AND price BETWEEN $1 AND $2 
      AND available_seats BETWEEN $3 AND $4
      AND status_id = 1
      AND ST_DistanceSphere(ST_MakePoint(departure_location[1],departure_location[2]),ST_MakePoint($5,$6)) BETWEEN $9 AND $10
      AND ST_DistanceSphere(ST_MakePoint(arrival_location[1],arrival_location[2]), ST_MakePoint($7, $8)) BETWEEN $9 AND $10
      ;`,
        [
          minPrice,
          maxPrice,
          minSeats,
          maxSeats,
          departure_location[0],
          departure_location[1],
          arrival_location[0],
          arrival_location[1],
          minRadius * 1000,
          maxRadius * 1000,
          date,
        ]
      );
      return response.rows;
    } catch (err) {
      console.error(err.message);
    }
  }

  async isPassengerInRide(user_id, ride_id) {
    const inRide = (
      await db.query(
        "SELECT EXISTS(SELECT * FROM user_ride WHERE user_id = $1 AND ride_id = $2)",
        [user_id, ride_id]
      )
    ).rows[0];

    return inRide;
  }
}

module.exports = new RideService();
