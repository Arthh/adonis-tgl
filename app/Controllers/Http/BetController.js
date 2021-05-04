'use strict'

const User = use('App/Models/User')
const Bet = use('App/Models/Bet')
const Game = use('App/Models/Game')
const Mail = use('Mail')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bets
 */
class BetController {
  /**
   * Show a list of all bets.
   * GET bets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response, params, auth }) {
    try {
      const bets = await Bet.query()
        .where({ game_id: params.game_id, user_id: auth.user.id })
        .with('user')
        .fetch()
      return bets
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro recuperar bets!' } })
    }
  }

  /**
   * Create/save a new bet.
   * POST bets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const { cart, totalPrice } = request.only(['cart', 'totalPrice'])

      const userId = auth.user.id
      const minCartValue = 30
      const user = await User.findByOrFail({ id: userId })

      if (totalPrice < minCartValue) {
        return response.status(401).send({ error: { message: 'Valor do carrinho inferior ao minimo!' } })
      }

      const gamesToSave = []
      const gamesFormatedForEmail = []

      // será permitido o usuario realizar um jogo igual a um feito anteriormente (type and numbers).
      for (let i = 0; i < cart.length; i++) {
        // verificar se existe números repetidos no cart[i].numbers
        const arrayNumbers = cart[i].numbers.split(',')
        if (new Set(arrayNumbers).size !== arrayNumbers.length) {
          return response.status(401).send({ error: { message: 'números repetidos dentro do mesmo jogo!' } })
        }
        const game = await Game.findByOrFail({ id: cart[i].game_id })

        cart[i].user_id = userId
        gamesToSave.push(cart[i])
        gamesFormatedForEmail.push({ type: game.type, numbers: cart[i].numbers, price: cart[i].price, day: cart[i].day })
      }

      const gamesSave = await Bet.createMany(gamesToSave)

      // enviando o email para o usuario
      await Mail.send(
        ['emails.new_bet'],
        { name: user.name, gamesFormatedForEmail },
        message => {
          message
            .to(user.email)
            .from('teste@teste.com', 'teste')
            .subject('Nova bet!')
        }
      )

      return gamesSave
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao realizar bet!' } })
    }
  }

  /**
   * Display a single bet.
   * GET bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   *    .where({ game_id: params.game_id, user_id: auth.user.id })
        .with('user')
        .fetch()
   */
  async show ({ params, response, auth }) {
    try {
      const bet = await Bet.query()
        .where({ id: params.id, user_id: auth.user.id })
        .with('game').fetch()
      return bet
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao recuperar bet desse usuario!' } })
    }
  }

  /**
   * Update bet details.
   * PUT or PATCH bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const data = request.only(['numbers'])
      const bet = await Bet.query().where('id', params.id).firstOrFail()
      bet.merge(data)

      await bet.save()
      return bet
    } catch (err) {
      return response.status(400).send({ error: { message: err.message } })
    }
  }

  /**
   * Delete a bet with id.
   * DELETE bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    try {
      const bet = await Bet.findByOrFail('id', params.id)
      await bet.delete()
      return
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao deletar bet!' } })
    }
  }
}

module.exports = BetController
