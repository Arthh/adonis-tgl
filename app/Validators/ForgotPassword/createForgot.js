'use strict'

class createForgot {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|email'
    }
  }
}

module.exports = createForgot
