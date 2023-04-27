const Router = require("express");
const rideRouter = new Router();
const rideController = require("../controller/ride.controller");
const authMiddleware = require("../middleware/auth-middleware");

rideRouter.post("/", authMiddleware, rideController.createRide);
rideRouter.get("/", authMiddleware, rideController.getAllRides);

rideRouter.post("/filter", authMiddleware, rideController.getRidesWithFilters);

rideRouter.get(
  "/rides_from_user/:user_id",
  authMiddleware,
  rideController.getRidesByUserId
);

rideRouter.get("/:ride_id", authMiddleware, rideController.getRideById);

rideRouter.put("/:ride_id", rideController.cancelRide);
rideRouter.delete("/:ride_id", rideController.deleteRide);

rideRouter.get("/driver/:driver_id", rideController.getRidesByDriverId);

rideRouter.post("/location", rideController.getRidesByCoordinates);

rideRouter.post("/passengers", rideController.addPassengerToRide);
rideRouter.post("/passengers/leave", rideController.deletePassengerFromRide);

rideRouter.get("/passengers/:ride_id", rideController.getPassengersByRideId);

rideRouter.post("/user-in-ride/:ride_id", rideController.isPassengerInRide);

module.exports = rideRouter;
