const Router = require("express");
const router = new Router();
const ratingController = require("../controller/rating.controller");

router.post("/", ratingController.addUserRating);
router.get("/", ratingController.getRatingUsersByRideId);

router.get("/:id", ratingController.getRatingByUserId);

module.exports = router;
