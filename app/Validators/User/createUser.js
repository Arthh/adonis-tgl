'use strict'

const Antl = use('Antl')

class createUser {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      email: 'required|email|unique:users',
      // é necessario ser confirmed?
      password: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = createUser
