import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'

export default class SchedulesController {
    /**
    * @swagger
    *  /api/v1/schedules:
    *      get:
    *          tags:
    *              - Schedules
    *          summary: Sample Api Get Schedules By UserId
    *          parameters:
    *              - name: page
    *                required: false
    *                in: query
    *                type: integer
    *              - name: limit
    *                required: false
    *                in: query
    *                type: integer
    *          security:
    *              - bearerAuth: []
    *          responses: 
    *              '200':
    *                  description: get data schedules! 
    *              '404':
    *                  description: bad request!
   */
    public async index({ response, request, auth }: HttpContextContract) {
        try {
            const page = request.qs().page || 1
            const limit = request.qs().limit || 10
            const userId = auth.user?.id

            if (userId) {
                let entity = await Booking.query().where('user_id', '=', userId)
                    .preload('field')
                    .paginate(page, limit)
                return response.ok({ message: 'success!', data: entity })
            }
            return response.badRequest({ message: 'error' })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }
}
