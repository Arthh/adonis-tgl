'use strict'

class BetsCreateBet {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      cart: 'required',
      totalPrice: 'required'
    }
  }
}

module.exports = BetsCreateBet
