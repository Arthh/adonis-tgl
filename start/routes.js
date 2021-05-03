'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// User Routes
Route.post('users', 'UserController.store')
Route.get('users', 'UserController.index')
Route.get('users/:id', 'UserController.show')

// User Routes | Reset/Update Pass
Route.post('passwords', 'ForgotPasswordController.store')
Route.put('passwords', 'ForgotPasswordController.update')

// Session routes
Route.post('sessions', 'SessionController.store')

Route.resource('games', 'GameController').apiOnly()
