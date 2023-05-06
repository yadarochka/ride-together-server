const Router = require("express");
const rideRouter = new Router();
const rideController = require("../controller/ride.controller");
const authMiddleware = require("../middleware/auth-middleware");

// создание поездки
rideRouter.post("/", authMiddleware, rideController.createRide);
// получение всех поездок
rideRouter.get("/", rideController.getAllRides);

// получение поездок с заданными фильтрами
rideRouter.post("/filter", rideController.getRidesWithFilters);

// получение всех поездок по id пользователя
rideRouter.get(
  "/rides_from_user/:user_id",
  authMiddleware,
  rideController.getRidesByUserId
);

// получение поездки по id
rideRouter.get("/:ride_id", authMiddleware, rideController.getRideById);

// отмена поездки
rideRouter.put("/:ride_id", authMiddleware, rideController.cancelRide);
//удаление поездки
rideRouter.delete("/:ride_id", authMiddleware, rideController.deleteRide);

// получение всех поездок по id водителя
rideRouter.get(
  "/driver/:driver_id",
  authMiddleware,
  rideController.getRidesByDriverId
);

// получение списка поездок по заданным координатам
rideRouter.post(
  "/location",
  authMiddleware,
  rideController.getRidesByCoordinates
);

// добавление пассажиров в поездку
rideRouter.post(
  "/passengers",
  authMiddleware,
  rideController.addPassengerToRide
);
// удаление пассажиров из поездки
rideRouter.post(
  "/passengers/leave",
  authMiddleware,
  rideController.deletePassengerFromRide
);

// получение всех пассажиров по id поездки
rideRouter.get(
  "/passengers/:ride_id",
  authMiddleware,
  rideController.getPassengersByRideId
);

// проверка, есть ли пользователь в поездке
rideRouter.post(
  "/user-in-ride/:ride_id",
  authMiddleware,
  rideController.isPassengerInRide
);

module.exports = rideRouter;
