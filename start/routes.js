'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// User Routes
Route.resource('users', 'UserController')
  .apiOnly()
  .middleware(new Map([
    [['index', 'update', 'destroy'], ['auth']]
  ]))
  .validator(new Map([[
    ['users.store'], ['User/createUser'],
    ['users.update'], ['User/updateUser']
  ]]))

// User Routes | Reset/Update Pass
Route.post('passwords', 'ForgotPasswordController.store').validator('ForgotPassword/createForgot')
Route.put('passwords', 'ForgotPasswordController.update').validator('ForgotPassword/updateForgot')

// Session routes
Route.post('sessions', 'SessionController.store').validator('Session/createSession')

Route.group(() => {
  Route.resource('games', 'GameController')
    .apiOnly()
    .validator(new Map([[
      ['games.store'], ['Game/createGame'],
      ['games.update'], ['Game/updateGame']
    ]]))

  Route.resource('games.bets', 'BetController')
    .apiOnly()
    .validator(new Map([[
      ['games.bets.store'], ['Bet/createBet'],
      ['games.bets.update'], ['Bet/updateBet']
    ]]))
}).middleware(['auth'])
