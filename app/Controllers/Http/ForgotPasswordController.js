'use strict'

const moment = require('moment')
const Mail = use('Mail')
const User = use('App/Models/User')
const crypto = require('crypto')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        { email, token: user.token, link: 'http://localhost:3000/reset-pass' },
        message => {
          message
            .to(user.email)
            .from('teste@teste.com', 'teste')
            .subject('Recuperação de senha!')
        }
      )
      return
    } catch (err) {
      return response.status(err.status).send({ error: { message: err.message } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ error: { message: 'token expirado!' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
      return
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Algo deu errado ao resetar sua senha!' } })
    }
  }
}

module.exports = ForgotPasswordController
