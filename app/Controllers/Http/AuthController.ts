import Mail from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import RegisterValidator from 'App/Validators/RegisterValidator';
import LoginValidator from 'App/Validators/LoginValidator';
import VerifyOtpValidator from 'App/Validators/VerifyOtpValidator';
import Database from '@ioc:Adonis/Lucid/Database';

export default class AuthController {
    /**
    * @swagger
    *  /api/v1/login:
    *      post:
    *          tags:
    *              - Authetication
    *          summary: Sample Api Login
    *          parameters:   
    *              - name: email
    *                required: true
    *                in: body
    *                type: string
    *              - name: password
    *                required: true
    *                in: body
    *                type: string
    *          responses: 
    *              '200':
    *                   description: success
    *              '400':
    *                   description: bad request
    */
    public async login({ auth, request, response }: HttpContextContract) {
        try {
            const validationLogin = await request.validate(LoginValidator)
            const entity = await auth.use('api').attempt(validationLogin.email, validationLogin.password)
            return response.ok({ message: 'login success!', data: entity })
        } catch (error) {
            return response.badRequest({ message: 'bad request!', error: error.message })
        }
    }


    /**
    * @swagger
    *  /api/v1/register:
    *      post:
    *          tags:
    *              - Authetication
    *          summary: Sample Api Register
    *          produces:
    *              - application/json
    *          parameters:   
    *              - name: name
    *                required: true
    *                in: body
    *                type: string   
    *              - name: email
    *                required: true
    *                in: body
    *                type: string
    *              - name: password
    *                required: true
    *                in: body
    *                type: string
    *              - name: string
    *                required: false
    *                in: body
    *                schema:
    *                  type: string
    *                  enum: [owner,user]
    *          responses: 
    *              '200':
    *                   description: success
    *              '400':
    *                   description: bad request
    */
    public async register({ request, response }: HttpContextContract) {
        try {
            const validationLogin = await request.validate(RegisterValidator)
            const otp_code = Math.floor(100000 + Math.random() * 900000)
            const entity = await User.create(validationLogin)
            await Database.table('otp_codes').insert({
                otp_code: otp_code,
                user_id: entity.id
            })

            // await Mail.send((message) => {
            //     message
            //         .from('admin@todoapi.com')
            //         .to(validationLogin.email)
            //         .subject('Welcome Onboard!')
            //         .htmlView('emails/otp_verification', { otp_code })
            // })
            return response.created({ message: 'login success!', data: entity })
        } catch (error) {
            return response.badRequest({ message: 'bad request!', error: error.messages })
        }
    }


    /**
    * @swagger
    *  /api/v1/otp_code:
    *      post:
    *          tags:
    *              - Authetication
    *          summary: Sample Api Verify Account
    *          parameters:
    *              - name: email
    *                required: true
    *                in: body
    *                type: string
    *              - name: otp_code
    *                required: true
    *                in: body
    *                type: integer
    *          responses: 
    *               '200':
    *                   description: status verify is true!
    *               '404':
    *                   description: bad request!
    */
    public async otpConfirmation({ request, response }: HttpContextContract) {
        try {
            const validation = await request.validate(VerifyOtpValidator)
            const entityOtp = await Database.from('otp_codes').where('otp_code', validation.otp_code).firstOrFail()
            const entityUser = await User.findByOrFail('email', validation.email)

            if (entityOtp.user_id == entityUser.id) {
                entityUser.isVerified = true
                await entityUser.save()
                await Database.from('otp_codes').where({
                    'otp_code': validation.otp_code,
                    'user_id': entityUser.id
                }).delete()
                return response.ok({ message: 'your account has been verified!' })
            }

            return response.badRequest({ message: 'something wrong with otp and email!' })
        } catch (error) {
            return response.badRequest({ message: 'something wrong!', error: error.message })
        }

    }
}
