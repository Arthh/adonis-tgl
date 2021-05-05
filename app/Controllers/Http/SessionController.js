'use strict'

const User = use('App/Models/User')

class SessionController {
  async store ({ request, response, auth }) {
    try {
      const { email, password } = request.all()

      const user = await User.findByOrFail('email', email)

      const token = await auth.attempt(email, password)
      return { user, token }
    } catch (err) {
      return response.status(err.status).send({ err: { message: 'Erro ao fazer login!' } })
    }
  }
}

module.exports = SessionController
