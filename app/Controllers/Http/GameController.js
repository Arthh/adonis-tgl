'use strict'

const Game = use('App/Models/Game')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with games
 */
class GameController {
  /**
   * Show a list of all games.
   * GET games
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ response }) {
    try {
      const games = await Game.all()
      return games
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao recuperar games!' } })
    }
  }

  /**
   * Create/save a new game.
   * POST games
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const data = request
        .only(['type', 'description', 'range', 'price', 'max_number', 'color', 'min_cart_value'])

      const game = await Game.create(data)

      return game
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao cadastrar game!' } })
    }
  }

  /**
   * Display a single game.
   * GET games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response }) {
    try {
      const game = await Game.findByOrFail('id', params.id)
      return game
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao recuperar game!' } })
    }
  }

  /**
   * Update game details.
   * PUT or PATCH games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const game = await Game.findByOrFail('id', params.id)
      const data = request
        .only(['type', 'description', 'range', 'price', 'max_number', 'color', 'min_cart_value'])

      game.merge(data)
      await game.save()
      return game
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao atualizar game!' } })
    }
  }

  /**
   * Delete a game with id.
   * DELETE games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    try {
      const game = await Game.findByOrFail('id', params.id)
      await game.delete()
      return
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro ao deletar game!' } })
    }
  }
}

module.exports = GameController
