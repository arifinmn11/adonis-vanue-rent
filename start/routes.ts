/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AuthController.register').as('auth.register')
  Route.post('/login', 'AuthController.login').as('auth.login')
  Route.post('/verify', 'AuthController.otpConfirmation').as('auth.verify')

  Route.group(() => {
    Route.get('/', 'VanuesController.index').as('vanues.index');
    Route.post('/', 'VanuesController.store').as('vanues.create').middleware(['auth'])
    Route.put('/:id', 'VanuesController.update').as('vanues.update').middleware(['auth'])
    Route.get('/:id', 'VanuesController.show').as('vanues.show')
    Route.delete('/:id', 'VanuesController.destroy').as('vanues.delete').middleware(['auth'])
  }).prefix('/vanues')

  Route.group(() => {
    Route.get('/', 'FieldsController.index').as('field.index')
    Route.post('/', 'FieldsController.store').as('field.create').middleware(['auth'])
    Route.put('/:id', 'FieldsController.update').as('field.update').middleware(['auth'])
    Route.get('/:id', 'FieldsController.show').as('field.show')
    Route.delete('/:id', 'FieldsController.destroy').as('field.delete').middleware(['auth'])
  }).prefix('/fields')

  Route.group(() => {
    Route.get('/', 'BookingsController.index').as('booking.index')
    Route.post('/', 'BookingsController.store').as('booking.create').middleware(['auth'])
    Route.put('/:id/join', 'BookingsController.join').as('booking.join').middleware(['auth'])
    Route.put('/:id/unjoin', 'BookingsController.unjoin').as('booking.unjoin').middleware(['auth'])
    Route.get('/:id', 'BookingsController.show').as('booking.show')
    // Route.delete('/:id', 'BookingsController.destroy').as('fields.delete').middleware(['auth'])
  }).prefix('/bookings')

  Route.group(() => {
    Route.get('/', 'SchedulesController.index').as('schedule.index').middleware(['auth'])
  }).prefix('/schedules')

}).prefix('/api/v1')
