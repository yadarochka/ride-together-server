const db = require("../db");
const RideService = require("../service/ride.service");

class RideController {
  async createRide(req, res) {
    try {
      const driver_id = req.user.id;
      const {departure_location, arrival_location, departure_date, available_seats, price, additional_details} = req.body;
      const total_seats = available_seats;
      const status_id = 1;
      const newRide = await RideService.createRide(
        driver_id,
        departure_location,
        arrival_location,
        departure_date,
        available_seats,
        total_seats,
        price,
        additional_details,
        status_id);
      res.json(newRide);
    } catch (error) {
      res.send(error.message);
    }
  }

  async getAllRides(req, res) {
    const allRides = await RideService.getAllRides();
    res.json(allRides);
  }

  async getRideById(req, res) {
    const rideId = req.params.ride_id;
    const {ride, code} = await RideService.getRideById(rideId);
    res.status(code).json(ride);
  }

  async getRidesByDriverId(req, res) {
    const driver_id = req.params.driver_id;
    const rides = await RideService.getRidesByDriverId(driver_id)
    res.json(rides);
  }

  async getRidesByUserId(req, res) {
    const user_id = req.params.user_id;
    const rides = await RideService.getRidesByUserId(user_id)
    res.json(rides);
  }

  async getRidesByCoordinates(req, res) {
    const coordinates = req.body;
    const rides = await RideService.getRidesByCoordinates(coordinates)
    res.json(rides);
  }

  async updateRide(req, res) {
    const id = req.params.id;
    const newRide = req.body;
    const updatedRide = await RideService.updateRide(id, newRide)
    res.json(updatedRide);
  }

  async deleteRide(req, res) {
    const id = req.params.ride_id;
    const {code, message} = await RideService.deleteRide(id)
    res.status(code).send(message);
  }

  async addPassengerToRide(req, res) {
    const {ride_id, user_id} = req.body;
    const {code, message} = await RideService.addPassengerToRide(ride_id, user_id)
    res.status(code).json(message)
  }

  async getRidesWithFilters(req, res){
    const rides = await RideService.getRidesWithFilters(req.body)
    res.status(200).json(rides)
  }
}

module.exports = new RideController();
