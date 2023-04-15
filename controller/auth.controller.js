const authService = require("../service/auth.service")

class AuthController{
    async login(req,res){
        try {
            const {email, password} = req.body;
            const newPerson = await authService.login(email, password);
            res.cookie('refreshToken', newPerson.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(201).json(newPerson);
        } catch (err) {
            res.status(400).json(err.message)
            }
    }
    async register(req,res){
        try {
            const newPerson = await authService.register(req.body);
            res.cookie('refreshToken', newPerson.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(201).json(newPerson);
        } catch (error) {
            res
                .status(400)
                .json(error.message);
            }
    }
    async logout(req,res){
        try {
            const {refreshToken} = req.cookies;
            await authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.status(200).json()
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
    async activate(req,res){
        try{
            const activationLink = req.params.link;
            await authService.activationMail(activationLink)
            res.redirect(process.env.CLIENT_URL)
        }
        catch(error){
            res.status(400).json(error.message)
        }
    }
    async refresh(req,res){
        try {
            const { refreshToken } = req.cookies
            const user = await authService.refresh(refreshToken)
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(201).json(newPerson);
        } catch (error) {
            res.status(500).json(error.message)
        }
    }
}

module.exports = new AuthController()