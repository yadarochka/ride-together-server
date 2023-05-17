const db = require("../db");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../middleware/exceptions/api-error");
const tokenService = require("./token.service");

class UserService {
  async createUser(user) {
    const { name, surname, phone, password, gender_id, email } = user;
    const newPerson = await db.query(
      `INSERT INTO users (name, surname, phone, password, gender_id, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, surname, phone, password, gender_id, email]
    );
    return newPerson.rows[0];
  }

  async getAllUsers() {
    const allUsers = await db.query(`SELECT * from users`);
    return allUsers.rows;
  }

  async getUser(id) {
    const user = (
      await db.query(
        `SELECT u.*, g.gender AS gender_name 
    FROM users u 
    JOIN gender g ON u.gender_id = g.id WHERE u.id = $1`,
        [id]
      )
    ).rows[0];
    if (user) {
      const userDto = new UserDto(user);
      return userDto;
    }

    throw ApiError.BadRequest("Пользователь с таким id не существует");
  }

  async updateUser(id, user) {
    const { name, surname, phone, gender_id } = user;
    await db.query(
      `UPDATE users SET name = $1, surname = $2, phone = $3,  gender_id = $4 WHERE id = ${id}`,
      [name, surname, phone, gender_id]
    );

    const newUser = (
      await db.query(
        `SELECT u.*, g.gender AS gender_name
        FROM users u
        JOIN gender g ON u.gender_id = g.id WHERE u.id = $1;`,
        [id]
      )
    ).rows[0];

    const userDto = new UserDto(newUser);

    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, userDto };
  }

  async deleteUser(id) {
    await db.query(`DELETE FROM users WHERE id = ${id}`);
  }
}

module.exports = new UserService();
