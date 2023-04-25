const Router = require("express");
const userRouter = new Router();
const authMiddleware = require('../middleware/auth-middleware')
const userController = require('../controller/user.controller')

userRouter.get("/:id", authMiddleware, userController.getUser);


module.exports = userRouter;