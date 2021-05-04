'use strict'

const Antl = use('Antl')

class GameUpdateGame {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      type: 'required|unique:games',
      description: 'required',
      range: 'required',
      price: 'required',
      max_number: 'required',
      color: 'required',
      min_cart_value: 'required'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = GameUpdateGame
