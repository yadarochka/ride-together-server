const tokenService = require('../service/token.service');
const ApiError = require('./exceptions/api-error')

module.exports = function (req, res, next){
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.UnathorizedError())
        }
        const accessToken = authHeader.split(' ')[1]
        const userData = tokenService.validateAccessToken(accessToken)
        if (!userData){
            return next(ApiError.UnathorizedError())
        }
        req.user = userData
        next()

    }catch(e){
        return next(ApiError.UnathorizedError())
    }
}