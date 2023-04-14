const authService = require("../service/auth.service")

class AuthController{
    async login(req,res){
        res.send('LOGIN')
    }
    async register(req,res){
        try {
            const newPerson = await authService.register(req.body);
            res.cookie('refreshToken', newPerson.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.status(201).json(newPerson);
        } catch (err) {
            res
                .status(400)
                .send(err.message);
            }
    }
    async logout(req,res){
        res.send('LOGOUT')
    }
    async activate(req,res){
        try{
            const activationLink = req.params.link;
            await authService.activationMail(activationLink)
            res.redirect(process.env.CLIENT_URL)
        }
        catch(e){
            res.send(e.message)
        }
    }
    async refresh(req,res){
        res.send('REFRESH')
    }
}

module.exports = new AuthController()