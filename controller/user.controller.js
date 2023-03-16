const userService = require("../service/user.service");

class UserController {
  async createUser(req, res) {
    try {
      const newPerson = await userService.createUser(req.body);
      res.status(201).json(newPerson);
    } catch (err) {
      if ((err.code = 23505)) {
        res
          .status(400)
          .send("Пользователь с таким номером уже зарегистрирован");
      }
    }
  }
  async getAllUsers(req, res) {
    try {
      const allUsers = await userService.getAllUsers();
      res.json(allUsers);
    } catch (err) {
      res.status(500).send(err);
    }
  }
  async getUser(req, res) {
    try {
      const id = req.params.id;
      const user = await userService.getUser(id);
      res.json(user);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
  async updateUser(req, res) {
    try {
      const id = req.params.id;
      const newPerson = await userService.updateUser(id, req.body);
      res.json(newPerson);
    } catch (err) {
      if ((err.code = 23505)) {
        res.status(400).send("Этот номер уже занят");
      }
      res.status(500).send(err);
    }
  }
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const message = await userService.deleteUser(id);
      res.status(204);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = new UserController();
