const db = require("../db");

class RideService {
  async createRide(driver_id,
    departure_location,
    arrival_location,
    departure_date,
    available_seats,
    total_seats,
    price,
    additional_details,
    status_id) {
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
          status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        driver_id,
        departure_location,
        arrival_location,
        departure_date,
        available_seats,
        total_seats,
        price,
        additional_details,
        status_id
      ]
    );
    return newRide.rows[0];
  }

  async getAllRides() {
    const allRides = await db.query(`SELECT ride.*, users.name AS driver_name
    FROM ride
    JOIN users ON ride.driver_id = users.id
    WHERE departure_date > now()`);
    return allRides.rows;
  }

  async getRideById(rideId){
    const ride = await db.query(`SELECT ride.*, name as status
    FROM ride JOIN status_ride 
    ON ride.status_id = status_ride.id
     WHERE id = ${rideId}`);
    if (ride.rows[0]){
      return {code: 200, ride: ride.rows[0]}
    }
    return {code: 404, ride: null}
  }

  async getRidesByDriverId(driver_id) {
    const rides = await db.query(
      `SELECT * from ride WHERE driver_id = ${driver_id}`
    );
    return(rides.rows);
  }
  
  async getRidesByUserId(user_id) {
    const rides = await db.query(
      `SELECT r.*
      FROM ride r
      JOIN user_ride ur ON r.id = ur.ride_id
      WHERE ur.user_id = $1
      ORDER BY r.departure_date ASC`,[user_id]
    );
    return(rides.rows);
  }

  async getRidesByCoordinates(coordinates) {
    const { lng, lat } = coordinates;
    const query =
      "SELECT * FROM ride WHERE ST_Distance_Sphere(departure_location, ST_MakePoint($1, $2)) < 10000";
    const values = [lng, lat];
    const rides = await db.query(query, values);
    return(rides.rows);
  }

  async updateRide(id, newRide){
    const {
      departure_location,
      arrival_location,
      departure_date,
      available_seats,
      total_seats,
      price,
      additional_details,
    } = newRide;
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
    return(updatedRide.rows[0]);
  }

  async deleteRide(id){
    try{
      await db.query(`DELETE FROM ride WHERE id = ${id}`);
      return {code: 204, message:"Поездка удалена"}
    }
    catch(err){
      return {code: 400, message:"Ошибка"}
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
      return {code: 200, message:"Пассажир добавлен в поездку"}
    } catch (err) {
      const query = `ROLLBACK`;
      await db.query(query);
      return {code: 500, message: err.message}
    }
  }

  async getRidesWithFilters({maxPrice, minPrice, maxSeats, minSeats}){
    try {
      const response = await db.query(`SELECT ride.*, users.name AS driver_name
      FROM ride
      JOIN users ON ride.driver_id = users.id 
      WHERE departure_date > now() AND
      price BETWEEN $1 AND $2 
      AND available_seats BETWEEN $3 AND $4;`, [minPrice, maxPrice, minSeats, maxSeats])

      return response.rows
    } catch (err) {
    }
  }
}

module.exports = new RideService();
