import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Role } from 'App/Enums/Role'
import Field from 'App/Models/Field'
import CreateFieldValidator from 'App/Validators/CreateFieldValidator'
import UpdateFieldValidator from 'App/Validators/UpdateFieldValidator'

export default class FieldsController {
    /**
     * @swagger
     *  /api/v1/fields:
     *      get:
     *          tags:
     *              - Fields
     *          summary: Sample Api Get Fields
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
     *                  description: get data fields
     *              '500':
     *                  description: internal server error
    */
    public async index({ response, request }: HttpContextContract) {
        try {
            let page = request.qs().page || 1
            let limit = request.qs().limit || 10

            let entity = await Field.query()
                .paginate(page, limit)
            response.ok({ message: 'success!', data: entity })
        } catch (error) {
            response.internalServerError({ message: 'something wrong', error: error })
        }
    }

    /**
     * @swagger
     *  /api/v1/fields:
     *      post:
     *          tags:
     *              - Fields
     *          summary: Sample Api Create Field
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: name
     *                required: true
     *                in: body
     *                type: string
     *              - name: type
     *                required: true
     *                in: body
     *                schema:
     *                  type: string
     *                  enum: [soccer,minisoccer,futsal,basketball,volleyball]
     *              - name: vanueId
     *                required: true
     *                in: body
     *                type: integer
     *          responses: 
     *               '201':
     *                   description: success
     *               '400':
     *                   description: bad request
     *               '401':
     *                   description: unauthorized
     */
    public async store({ request, response, auth }: HttpContextContract) {
        try {
            let validation = await request.validate(CreateFieldValidator)
            if (auth.user?.role !== Role.owner) {
                return response.unauthorized({ message: "unauthorized, only role owner can created field!" })
            }
            let createData = await Field
                .create(validation)
            return response.created({ message: "created!", data: createData })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized!', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }

    /**
    * @swagger
    *  /api/v1/fields/{id}:
    *      get:
    *          tags:
    *              - Fields
    *          summary: Sample Api Find By Id
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
            let { id } = params;
            let entity = await Field.findOrFail(id)
            await entity.preload('vanue')
            response.ok({ message: 'success!', data: entity })

        } catch (error) {
            response.notFound({ message: 'not found!' })
        }
    }

    /**
    * @swagger
    *  /api/v1/fields/{id}:
    *      put:
    *          tags:
    *              - Fields
    *          summary: Sample Api Update
    *          security:
    *              - bearerAuth: []
    *          parameters:
    *              - name : id
    *                in: path
    *                required: true
    *              - name : name
    *                in: body
    *                required: true
    *              - name: type
    *                required: true
    *                in: body
    *                schema:
    *                  type: string
    *                  enum: [soccer,minisoccer,futsal,basketball,volleyball]
    *              - name : vanueId
    *                in: body
    *                required: true
    *          responses: 
    *               '201':
    *                   description: success
    *               '404':
    *                   description: bad request
    */
    public async update({ request, response, params, auth }: HttpContextContract) {
        try {
            let { id } = params;
            await request.validate(UpdateFieldValidator)
            if (auth.user?.role !== Role.owner) {
                return response.unauthorized({ message: "unauthorized, only role owner can update field!" })
            }

            let entity = await Field.findOrFail(id)

            entity.name = request.input('name'),
                entity.type = request.input('type'),
                entity.vanueId = request.input('vanue_id')

            entity.save()

            response.ok({ message: 'success!', data: entity })

        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.message })
        }
    }

    /**
     * @swagger
     *  /api/v1/fields/{id}:
     *      delete:
     *          tags:
     *              - Fields
     *          summary: Sample Api Delete By Id
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
    public async delete({ response, params, auth }: HttpContextContract) {
        try {
            let { id } = params;
            if (auth.user?.role !== Role.owner) {
                return response.unauthorized({ message: "unauthorized, only role owner can delete field!" })
            }

            let entity = await Field.findOrFail(id)
            await entity.delete()
            response.ok({ message: 'success!' })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.message })
        }
    }
}

