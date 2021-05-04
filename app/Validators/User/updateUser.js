'use strict'

const Antl = use('Antl')

class updateUser {
  get validateAll () {
    console.log('teste')
    return true
  }

  // Adonis Ctx https://adonisjs.com/docs/4.0/validator = Custom Rules

  get rules () {
    const userId = this.ctx.params.id

    return {
      name: 'required',
      email: `unique:users,email,id,${userId}`,
      password: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = updateUser
