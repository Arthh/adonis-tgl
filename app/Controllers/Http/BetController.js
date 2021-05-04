'use strict'

const Bet = use('App/Models/Bet')

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
        .where({ game_id: params.games_id, user_id: auth.user.id })
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
  async store ({ request, params, response, auth }) {
    try {
      const { cart, totalPrice, minCartValue } = request.only(['cart', 'totalPrice'])

      if (totalPrice < minCartValue) {
        return response.status(401).send({ error: { message: 'Valor do carrinho inferior ao minimo!' } })
      }

      const gamesToSave = []

      // verificação obsoleta.
      // será permitido o usuario realizar um jogo igual a um feito anteriormente (type and numbers).
      for (let i = 0; i < cart.length; i++) {
        cart[i].game_id = Number(params.games_id)
        cart[i].user_id = Number(auth.user.id)
        gamesToSave.push(cart[i])
      }
      const gamesSave = await Bet.createMany(gamesToSave)
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
      const bet = await Bet
        .query().where({ id: params.id, game_id: params.games_id, user_id: auth.user.id })
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
