import type { HttpContext } from '@adonisjs/core/http'
import UpdateMvestProfileRequestValidator from '#validators/v1/mvest/update_mvest_profile_request_validator'

export default class UpdateMvestProfileController {
  async handle({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(UpdateMvestProfileRequestValidator)
    const owner = auth.use('mvestOwner').user!
    owner.merge(payload)
    await owner.save()
    return response.ok({
      status: 'success',
      status_code: 200,
      message: 'Profile updated successfully.',
      results: owner,
    })
  }
}
