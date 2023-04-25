const authService = require("../service/auth.service")

class AuthController{
    async login(req,res, next){
        try {
            const {email, password} = req.body;
            const newPerson = await authService.login(email, password);
            res.cookie('refreshToken', newPerson.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(200).json(newPerson);
        } catch (error) {
            next(error)
            }
    }
    async register(req,res, next){
        try {
            const newPerson = await authService.register(req.body);
            res.cookie('refreshToken', newPerson.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(201).json(newPerson);
        } catch (error) {
            next(error)
        }
    }
    async logout(req,res, next){
        try {
            const {refreshToken} = req.cookies;
            await authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.status(200).json()
        } catch (error) {
            next(error)
        }
    }
    async activate(req,res, next){
        try{
            const activationLink = req.params.link;
            await authService.activationMail(activationLink)
            res.redirect(process.env.CLIENT_URL)
        }
        catch(error){
            next(error)
        }
    }
    async refresh(req,res, next){
        try {
            const oldRefreshToken = req.cookies.refreshToken
            const userData = await authService.refresh(oldRefreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(200).json(userData);
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new AuthController()