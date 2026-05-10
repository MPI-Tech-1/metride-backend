import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import PopularLocationActions from '#model_management/actions/popular_location_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class GetPopularLocationController {
  async handle({ response, request }: HttpContext) {
    const { identifier } = request.params()

    try {
      const popularLocation = await PopularLocationActions.getPopularLocation({
        identifier,
        identifierType: 'identifier',
      })

      if (!popularLocation) {
        return response.status(HttpStatusCodesEnum.NOT_FOUND).send({
          status_code: HttpStatusCodesEnum.NOT_FOUND,
          status: ERROR,
          message: 'Popular location not found',
        })
      }

      const mutatedPayload = {
        identifier: popularLocation.identifier,
        city: {
          identifier: popularLocation.city.identifier,
          name: popularLocation.city.name,
          longitude: popularLocation.city.longitude,
          latitude: popularLocation.city.latitude,
        },
        name: popularLocation.name,
        gpsCoordinates: popularLocation.gpsCoordinates,
        typeOfLocation: popularLocation.typeOfLocation,
        isActive: popularLocation.isActive,
      }

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Popular location fetched successfully',
        results: mutatedPayload,
      })
    } catch (GetPopularLocationControllerError) {
      console.log('GetPopularLocationControllerError -> ', GetPopularLocationControllerError)
      await logApplicationError(GetPopularLocationControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
