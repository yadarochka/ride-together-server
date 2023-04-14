const db = require("../db");
const bcrypt = require("bcrypt")
const uuid = require('uuid');
const UserDto = require("../dtos/user-dto");
const userService = require("./user.service");
const tokenService = require("./token.service");

class AuthService {
    async register(user){
        const { name, surname, phone, gender_id, password, email } = user;

        const candidate = (await db.query("SELECT * from users WHERE phone = $1", [email])).rows[0]

        if (candidate){
            throw new Error("Пользователь с такой почтой уже зарегистрирован")
        }
        
        const hashPassword = await bcrypt.hash(password, 3)
        const activationLink = uuid.v4()

        await db.query(
            `INSERT INTO users (name, surname, phone, password, gender_id, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, surname, phone, password, gender_id, email]
          );

        const newPerson = await db.query(`SELECT u.*, g.gender AS gender_name
        FROM users u
        JOIN gender g ON u.gender_id = g.id WHERE email = $1;`,[email])


        const userDto = new UserDto(newPerson.rows[0])

        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken)

        return {...tokens, userDto}
    }
}

module.exports = new AuthService()