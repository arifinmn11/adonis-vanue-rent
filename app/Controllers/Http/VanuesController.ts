import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Role } from 'App/Enums/Role';

import Vanue from "App/Models/Vanue";
import CreateVanueValidator from 'App/Validators/CreateVanueValidator';
import UpdateVanueValidator from 'App/Validators/UpdateVanueValidator';
import Env from '@ioc:Adonis/Core/Env'
import Url from 'url-parse'
export default class VanuesController {
    /**
     * @swagger
     *  /api/v1/vanues:
     *      get:
     *          tags:
     *              - Vanues
     *          summary: Sample Api Get Vanues
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
     *                  description: get data vanues
     *              '500':
     *                  description: internal server error
    */
    public async index({ response, request }: HttpContextContract) {
        try {

            const CLEARDB_DATABASE_URL = new Url(Env.get('CLEARDB_DATABASE_URL'))
            console.log(CLEARDB_DATABASE_URL.host, CLEARDB_DATABASE_URL.pathname.substr(1))
            const page = request.qs().page ? request.qs().page : 1
            const limit = request.qs().limit ? request.qs().limit : 10

            const entity = await Vanue.query()
                .paginate(page, limit)

            return response.ok({
                message: 'success!',
                data: entity
            })
        } catch (error) {
            return response.badRequest({ message: 'bad request!', error: error.message })
        }
    }

    /**
     * @swagger
     *  /api/v1/vanues:
     *      post:
     *          tags:
     *              - Vanues
     *          summary: Sample Api Crate Vanues
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name: name
     *                required: true
     *                in: body
     *                type: string
     *              - name: phone
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
            const validation = await request.validate(CreateVanueValidator)
            const userId = auth.user?.id
            if (auth.user?.role !== Role.owner) {
                return response.unauthorized({ message: "unauthorized, only role owner can created vanue!" })
            }

            if (userId != undefined) {
                const entity = await Vanue.create({
                    name: validation.name,
                    phone: validation.phone,
                    userId: userId
                })
                return response.created({ message: 'succes!', data: entity })
            }
            return response.badGateway({ message: 'cannot found user!' })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized!', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }

    /**
     * @swagger
     *  /api/v1/vanues/{id}:
     *      get:
     *          tags:
     *              - Vanues
     *          summary: Sample Api Find Vanue By Id
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
            const entity = await Vanue
                .findOrFail(id)
            return response.ok({ message: 'succes!', data: entity })

        } catch (error) {
            return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }

    /**
     * @swagger
     *  /api/v1/vanues/{id}:
     *      put:
     *          tags:
     *              - Vanues
     *          summary: Sample Api Update Vanue By Id
     *          security:
     *              - bearerAuth: []
     *          parameters:
     *              - name : id
     *                in: path
     *                required: true
     *              - name: name
     *                required: true
     *                in: body
     *                type: string
     *              - name: phone
     *                required: true
     *                in: body
     *                type: string
     *          responses: 
     *               '200':
     *                  description: success
     *               '401':
     *                  description: unauthorized
     *               '404':
     *                  description: bad request
     */
    public async update({ response, request, auth, params }: HttpContextContract) {
        try {
            const { id } = params
            const validation = await request.validate(UpdateVanueValidator)
            if (auth.user?.role !== Role.owner) {
                return response.unauthorized({ message: "unauthorized, only role owner can update vanue!" })
            }
            const entity = await Vanue
                .findOrFail(id)
            const userId = auth.user?.id

            if (userId != undefined && entity) {
                entity.name = validation.name
                entity.phone = validation.phone
                entity.userId = userId

                await entity.save()

                return response.ok({ message: 'succes!', data: entity })
            }

            return response.badGateway({ message: 'cannot found data!' })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.message })
        }
    }

    /**
     * @swagger
     *  /api/v1/vanues/{id}:
     *      delete:
     *          tags:
     *              - Vanues
     *          summary: Sample Api Delete Vanues By Id
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
    public async destroy({ response, params, auth }: HttpContextContract) {
        try {
            const { id } = params
            if (auth.user?.role !== Role.owner) {
                return response.unauthorized({ message: "unauthorized, only role owner can created vanue!" })
            }
            const entity = await Vanue
                .findOrFail(id)
            await entity.delete()
            return response.ok({ message: 'succes!' })
        } catch (error) {
            if (error.guard)
                return response.unauthorized({ message: 'unauthorized', error: error.message })
            else
                return response.badRequest({ message: 'bad request!', error: error.message })
        }
    }
}
