const Router = require("express");
const router = new Router();
const ratingController = require("../controller/rating.controller");

router.post("/", ratingController.addUserRating);
router.get("/", ratingController.getAllRating);
router.get("/:id", ratingController.getAverageRating);

module.exports = router;
