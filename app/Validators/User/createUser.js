'use strict'

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
}

module.exports = createUser
