import type { HttpContext } from '@adonisjs/core/http'
import AuthenticateMvestOwnerRequestValidator from '#validators/v1/mvest/authenticate_mvest_owner_request_validator'
import MvestOwner from '#models/mvest_owner'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES } from '#common/messages/system_messages'

export default class AuthenticateMvestOwnerController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(AuthenticateMvestOwnerRequestValidator)
    const owner = await MvestOwner.query().where('email', payload.email).first()
    if (!owner || !(await hash.verify(owner.password, payload.password))) {
      return response.badRequest({
        status: 'error',
        status_code: 400,
        message: 'Invalid credentials.',
      })
    }
    if (owner.status !== 'active') {
      return response.forbidden({
        status: 'error',
        status_code: 403,
        message: 'MVest owner account is not active.',
      })
    }
    owner.lastLoggedInAt = DateTime.now()
    await owner.save()
    const accessCredentials = await MvestOwner.accessTokens.create(owner, ['*'], {
      expiresIn: `${ACCESS_TOKEN_EXPIRATION_TIME_FRAME_IN_MINUTES} minutes`,
    })
    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'Authentication successful.',
      results: {
        owner: {
          identifier: owner.identifier,
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
        },
        accessCredentials,
      },
    })
  }
}
