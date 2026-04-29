import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import UploadImageRequestValidator from '#validators/v1/common/media/upload_image_request_validator'
import configureMediaUploadProvider from '#infrastructure_providers/helpers/configure_media_upload_provider'

export default class UploadImageController {
  async handle({ request, response }: HttpContext) {
    const { image: file } = await request.validateUsing(UploadImageRequestValidator)

    try {
      const imageUploader = configureMediaUploadProvider()

      const { url } = await imageUploader.uploadImage({
        file,
      })

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Image uploaded successfully.',
        results: { url },
      })
    } catch (UploadImageControllerError) {
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
