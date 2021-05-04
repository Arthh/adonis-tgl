'use strict'

const Antl = use('Antl')

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

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = BetsUpdateBet
