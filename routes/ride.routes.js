const Router = require("express");
const rideRouter = new Router();
const rideController = require("../controller/ride.controller");

rideRouter.post("/create", rideController.createRide);
rideRouter.get("/", rideController.getAllRides);
rideRouter.get("/:id", rideController.getRideById);
rideRouter.put("/:id", rideController.updateRide);
rideRouter.delete("/:id", rideController.deleteRide);
rideRouter.get("/driver/:id", rideController.getRidesByDriverId);
rideRouter.get("/location", rideController.getRidesByCoordinates);
rideRouter.post("/add", rideController.addPassengerToRide);

module.exports = rideRouter;
