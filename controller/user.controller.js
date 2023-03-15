const db = require('../db')

class UserController {
    async createUser(req, res){
        const {name, surname, phone, password} = req.body
        const newPerson = await db.query(`INSERT INTO users (name, surname, phone, password) VALUES ($1, $2, $3, $4) RETURNING *`,[name, surname, phone, password])
        res.json(newPerson.rows[0])
    }
    async getAllUsers(req, res){
        const allUsers = await db.query(`SELECT * from users`)
        res.json(allUsers.rows)
    }
    async getUser(req, res){
        const id = req.params.id;
        const user = await db.query(`SELECT * from users WHERE id = ${id}`)
        res.json(user.rows[0])
    }
    async updateUser(req, res){
        const {name, surname, phone, password} = req.body
        const id = req.params.id;
        const newPerson = await db.query(`UPDATE users SET name = $1, surname = $2, phone = $3, password = $4 WHERE id = ${id} RETURNING *`,[name, surname, phone, password])
        res.json(newPerson.rows[0])
    }
    async deleteUser(req, res){
        const id = req.params.id;
        await db.query(`DELETE FROM users WHERE id = ${id}`)
        res.json('ok')
    }
}

module.exports = new UserController()