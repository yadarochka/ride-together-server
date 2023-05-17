const Router = require("express");
const userRouter = new Router();
const authMiddleware = require("../middleware/auth-middleware");
const userController = require("../controller/user.controller");

userRouter.get("/:id", authMiddleware, userController.getUser);
userRouter.patch("/:id", authMiddleware, userController.updateUser);

module.exports = userRouter;
