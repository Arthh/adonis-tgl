'use strict'

const User = use('App/Models/User')

class UserController {
  async index ({ response }) {
    try {
      const users = await User.query().select('id', 'name', 'email').fetch()
      return users
    } catch (err) {
      return response.status(err.status).send({ error: { message: err.message } })
    }
  }

  async show ({ auth, response }) {
    try {
      const user = await User.findByOrFail('id', auth.user.id)
      return user
    } catch (err) {
      return response.status(err.status).send({ error: { message: err.message } })
    }
  }

  async store ({ request, response }) {
    try {
      const data = request.only(['name', 'email', 'password'])
      console.log('User create email:', data.email, 'password:', data.password)
      const user = await User.create(data)
      return user
    } catch (err) {
      return response.status(err.status).send({ error: { message: err.message } })
    }
  }

  async update ({ auth, request, response }) {
    try {
      const user = await User.findByOrFail('id', auth.user.id)
      const data = request.only(['name', 'email', 'password'])
      console.log('user:', user)
      user.merge(data)
      await user.save()
    } catch (err) {
      return response.status(err.status).send({ err: { message: err.message } })
    }
  }

  async destroy ({ params, response }) {
    try {
      const user = await User.findByOrFail('id', params.id)
      await user.delete()
    } catch (err) {
      return response.status(err.status).send({ err: { message: err.message } })
    }
  }
}

module.exports = UserController
