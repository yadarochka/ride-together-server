const Router = require("express");
const rideRouter = new Router();
const rideController = require("../controller/ride.controller");

rideRouter.post("/", rideController.createRide);
rideRouter.get("/", rideController.getAllRides);

rideRouter.get("/:ride_id", rideController.getRideById);
rideRouter.put("/:ride_id", rideController.updateRide);
rideRouter.delete("/:ride_id", rideController.deleteRide);

rideRouter.get("/driver/:driver_id", rideController.getRidesByDriverId);

rideRouter.post("/location", rideController.getRidesByCoordinates);

rideRouter.post("/passengers", rideController.addPassengerToRide);

module.exports = rideRouter;
