'use strict'

class BetsUpdateBet {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      numbers: 'required',
      totalPrice: 'required'
    }
  }
}

module.exports = BetsUpdateBet
