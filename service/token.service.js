const jwt = require('jsonwebtoken')
const db = require("../db");

class TokenService {
    generateTokens(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "1d"})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "90d"})
        return {
            accessToken, refreshToken
        }
    }

    async saveRefreshToken(userId, refreshToken){
        const tokenData = (await db.query("SELECT token FROM tokens WHERE user_id = $1", [userId])).rows[0]
        
        if (tokenData){
            await db.query("UPDATE tokens SET token = $1 WHERE user_id = $2", [refreshToken, userId])
        }
        else{
            await db.query("INSERT INTO tokens (user_id, token) VALUES ($1, $2)", [userId, refreshToken])
        }

    }

    async removeToken(refreshToken){
        await db.query("DELETE FROM tokens WHERE token = $1", [refreshToken])
    }

    async findToken(refreshToken){
        const token = (await db.query("SELECT token FROM tokens WHERE token = $1",[refreshToken])).rows[0]
        return token
    }

    validateAccessToken(accessToken){
        try {
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }

    async validateRefreshToken(refreshToken){
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }
}

module.exports = new TokenService()