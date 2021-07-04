import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Booking from 'App/Models/Booking'
import Field from 'App/Models/Field'
import CreateBookingValidator from 'App/Validators/CreateBookingValidator'
import Application from '@ioc:Adonis/Core/Application'

export default class BookingsController {
    /**
     * @swagger
     *  /api/v1/bookings:
     *      get:
     *          tags:
     *              - Bookings
     *          summary: Sample Get Bookings
     *          parameters:
     *              - name: page
     *                required: false
     *                in: query
     *                type: integer
     *              - name: limit
     *                required: false
     *                in: query
     *                type: integer
     *          responses:
     *              '200':
     *                  description: success!
     *              '500':
     *                  description: internal server error!
     */
    public async index({ response, request }: HttpContextContract) {
        try {
            console.log(Application.inDev)
            let page = request.qs().page || 1
            let limit = request.qs().limit || 10

            let entity = await Booking.query()
                .preload('field')
                .paginate(page, limit)
            response.ok({ message: 'success!', data: entity })
        } catch (error) {
            response.internalServerError({ message: 'something wrong', error: error })
        }
    }

    /**
     * @swagger
     *  /api/v1/bookings:
     *      post:
     *          tags:
     *              - Bookings
     *          summary: Sample Api Crate Booking
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: name
     *                required: true
     *                in: body
     *                type: string
     *              - name: playDateEnd
     *                required: true
     *                in: body
     *                type: string
     *              - name: playDateStart
     *                required: true
     *                in: body
     *                type: string
     *              - name: fieldId
     *                required: true
     *                in: body
     *                type: string
     *          responses: 
     *              '200':
     *                  description: success
     *              '401':
     *                  description: unauthorized
     *              '404':
     *                  description: bad request
     *
     */
    public async store({ response, request, auth }: HttpContextContract) {
        try {
            let validation = await request.validate(CreateBookingValidator)
            let field = await Field.findOrFail(validation.fieldId)
            let createData = await Booking
                .create({
                    playDateEnd: validation.playDateEnd,
                    playDateStart: validation.playDateStart,
                    userId: auth.user?.id,
                    fieldId: field.id
                })
            response.created({ message: "succes!", data: createData })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized!', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }

    /**
    * @swagger
    *  /api/v1/bookings/{id}:
    *      get:
    *          tags:
    *              - Bookings
    *          summary: Sample Api Booking Find By Id
    *          parameters:
    *              - name : id
    *                in: path
    *                required: true
    *          responses: 
    *               '201':
    *                   description: success
    *               '404':
    *                   description: bad request
    */
    public async show({ response, params }: HttpContextContract) {
        try {
            const { id } = params
            const booking = await Booking.query()
                .where('id', id)

                .withCount('players', (query) => {
                    query.as('playersCount')
                })
                .preload('players')
                .preload('field')
                .firstOrFail()
            booking.$extras.playersCount

            response.created({ "message": "berhasil booking", data: booking })
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    /**
    * @swagger
    *  /api/v1/bookings/{id}/join:
    *      put:
    *          tags:
    *              - Bookings
    *          summary: Sample Api Join to Booking
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - name : id
    *                in: path
    *                required: true
    *          responses: 
    *               '201':
    *                  description: success
    *               '401':
    *                  description: unauthorized
    *               '404':
    *                  description: bad request
    */
    public async join({ response, params, auth }: HttpContextContract) {
        try {
            const { id } = params
            const booking = await Booking.find(id)
            const userId = auth.user?.id
            if (userId) {
                await booking?.related('players').attach([userId])
                return response.created({ "message": "berhasil booking" })
            }
            return response.badRequest({ message: 'bad request!', booking })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized!', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }

    /**
    * @swagger
    *  /api/v1/bookings/{id}/unjoin:
    *      put:
    *          tags:
    *              - Bookings
    *          summary: Sample Api Unjoin to Booking
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - name : id
    *                in: path
    *                required: true
    *          responses: 
    *               '200':
    *                  description: success
    *               '401':
    *                  description: unauthorized
    *               '404':
    *                  description: bad request
    */
    public async unjoin({ response, params, auth }: HttpContextContract) {
        try {
            const { id } = params
            const booking = await Booking.find(id)
            const userId = auth.user?.id
            if (userId) {
                await booking?.related('players').detach([userId])
                return response.created({ "message": "berhasil membatalkan!" })
            }
            return response.badRequest({ message: 'bad request!', booking })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized!', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }
}
