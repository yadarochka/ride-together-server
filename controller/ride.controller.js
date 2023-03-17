const db = require("../db");
const RideService = require("../service/ride.service");

class RideController {
  async createRide(req, res) {
    try {
      const ride = req.body;
      const newRide = await RideService.createRide(ride);
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
    res.status(code).send(message)
  }
}

module.exports = new RideController();
