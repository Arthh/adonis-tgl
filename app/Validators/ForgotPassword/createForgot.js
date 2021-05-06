'use strict'

class ForgotPasswordCreateForgot {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      email: 'required|email'
    }
  }
}

module.exports = ForgotPasswordCreateForgot
