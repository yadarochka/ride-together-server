const db = require("../db");

class UserService {
  async createUser(user) {
    const { name, surname, phone, password, gender_id } = user;
    const newPerson = await db.query(
      `INSERT INTO users (name, surname, phone, password, gender_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, surname, phone, password, gender_id]
    );
    return newPerson.rows[0];
  }

  async getAllUsers() {
    const allUsers = await db.query(`SELECT * from users`);
    return allUsers.rows;
  }

  async getUser(id) {
    const user = await db.query(`SELECT * from users WHERE id = ${id}`);
    if (user.rows[0]) {
      return user.rows[0];
    } else {
      throw Error("Пользователь с таким id не существует");
    }
  }

  async updateUser(id, user) {
    const { name, surname, phone, password, gender_id } = user;
    const newPerson = await db.query(
      `UPDATE users SET name = $1, surname = $2, phone = $3, password = $4, gender_id = $5 WHERE id = ${id} RETURNING *`,
      [name, surname, phone, password, gender_id]
    );
    return newPerson.rows[0];
  }

  async deleteUser(id) {
    await db.query(`DELETE FROM users WHERE id = ${id}`);
  }
}

module.exports = new UserService();
