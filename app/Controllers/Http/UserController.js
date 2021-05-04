'use strict'

const User = use('App/Models/User')

class UserController {
  async index ({ response }) {
    try {
      const users = await User.query().select('id', 'name', 'email').fetch()
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
    try {
      const data = request.only(['name', 'email', 'password'])
      const user = await User.create(data)
      return user
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao cadastrar' } })
    }
  }

  async update ({ params, request, response }) {
    try {
      const user = await User.findByOrFail('id', params.id)
      const data = request.only(['name', 'email', 'password'])
      user.merge(data)
      await user.save()
    } catch (err) {
      return response.status(err.status).send({ err: { message: 'Erro ao atualizar usuario!' } })
    }
  }

  async destroy ({ params, response }) {
    try {
      const user = await User.findByOrFail('id', params.id)
      await user.delete()
    } catch (err) {
      return response.status(err.status).send({ err: { message: 'Erro ao deletar usuario!' } })
    }
  }
}

module.exports = UserController
