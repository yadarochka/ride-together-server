const nodemailer = require('nodemailer')

class MailService{

    constructor(){
        this.transporter = nodemailer.createTransport({
            host:process.env.SMTP_HOST,
            port:process.env.SMTP_PORT,
            secure: true,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
    }

    async sendActivationCode(to, link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Активация аккаунта на " + process.env.API_URL,
            text: '',
            html:`
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">Активировать аккаунт</a>
                </div>
            `
        })
    }
}

module.exports = new MailService()