'use strict'

const Mail = use('Mail')
const User = use('App/Models/User')

class UserController {
  async index ({ response }) {
    try {
      const users = await User.query().select('name', 'email').fetch()
      return users
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao recuperar games!' } })
    }
  }

  async show ({ params, response }) {
    try {
      const user = await User.findByOrFail('id', params.id)
      return user
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao buscar usuario!' } })
    }
  }

  async store ({ request, response }) {
    const data = request.only(['name', 'email', 'password'])
    try {
      const user = await User.create(data)

      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password-text'],
        { email: data.email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('teste@teste.com', 'teste')
            .subject('Recuperação de senha!')
        }
      )
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao cadastrar' } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const user = await User.findByOrFail(params.id)
      const data = request.only(['name', 'email', 'password'])

      user.merge(data)
      await user.save()
    } catch (err) {
      return response.status(err.status).send({ err: { message: 'Erro ao atualizar usuario!' } })
    }
  }

  async delete ({ params, response }) {
    try {
      const user = await User.findByOrFail(params.id)
      await user.delete()
    } catch (err) {
      return response.status(err.status).send({ err: { message: 'Erro ao deletar usuario!' } })
    }
  }
}

module.exports = UserController
