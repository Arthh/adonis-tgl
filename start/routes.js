'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// User Routes
Route.post('users', 'UserController.store').validator('User/createUser')

// User Routes | Reset/Update Pass
Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPassword/createForgot')
Route.put('passwords', 'ForgotPasswordController.update').validator('ForgotPassword/updateForgot')

// Session routes
Route.post('sessions', 'SessionController.store').validator('Session/createSession')

// Auth Routes
Route.group(() => {
  // User
  Route.put('users', 'UserController.update').validator('User/updateUser')
  Route.get('users', 'UserController.show')
  Route.get('users', 'UserController.index')
  Route.delete('users', 'UserController.destroy')

  // Games
  Route.resource('games', 'GameController')
    .apiOnly()
    .validator(new Map([[
      ['games.store'], ['Game/createGame'],
      ['games.update'], ['Game/updateGame']
    ]]))

  // Bets
  Route.get('games/bets/:game_id', 'BetController.index')
  Route.get('games/bets/show/:id', 'BetController.show')
  Route.post('games/bets', 'BetController.store').validator('Bet/createBet')
  Route.put('games/bets/:id', 'BetController.store').validator('Bet/updateBet')
  Route.delete('games/bets/:id', 'BetController.destroy')
}).middleware(['auth'])
