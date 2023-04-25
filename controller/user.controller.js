const userService = require("../service/user.service");

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const allUsers = await userService.getAllUsers();
      res.json(allUsers);
    } catch (err) {
      next(err)
    }
  }
  async getUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await userService.getUser(id);
      res.json(user);
    } catch (err) {
      next(err)
    }
  }
  async updateUser(req, res, next) {
    try {
      const id = req.params.id;
      const newPerson = await userService.updateUser(id, req.body);
      res.json(newPerson);
    } catch (err) {
      next(err)
    }
  }
  async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      await userService.deleteUser(id);
      res.status(204);
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new UserController();
