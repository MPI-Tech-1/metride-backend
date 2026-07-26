import { type HttpContext } from '@adonisjs/core/http'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR, SOMETHING_WENT_WRONG, SUCCESS } from '#common/messages/system_messages'
import InvestorVehicleActions from '#model_management/actions/investor_vehicle_actions'
import logApplicationError from '#common/helper_functions/log_application_error'

export default class FetchInvestorVehiclesController {
  async handle({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 20)
      const searchQuery = request.input('search', '')
      const investorId = request.input('investorId')

      const { investorVehiclePayload: investorVehicles, paginationMeta } =
        await InvestorVehicleActions.listInvestorVehicles({
          filterRecordOptionsPayload: {
            searchQuery: searchQuery || undefined,
            investorId: investorId ? Number(investorId) : undefined,
          },
          paginationPayload: { page, limit },
        })

      const mutatedInvestorVehicles = investorVehicles.map((vehicle) => ({
        identifier: vehicle.identifier,
        investor: vehicle.investor
          ? {
              identifier: vehicle.investor.identifier,
              firstName: vehicle.investor.firstName,
              lastName: vehicle.investor.lastName,
              fullName: vehicle.investor.fullName,
              email: vehicle.investor.email,
            }
          : null,
        rideType: vehicle.rideType
          ? {
              identifier: vehicle.rideType.identifier,
              name: vehicle.rideType.name,
            }
          : null,
        vehicleMake: vehicle.vehicleMake
          ? {
              identifier: vehicle.vehicleMake.identifier,
              name: vehicle.vehicleMake.name,
            }
          : null,
        vehicleModel: vehicle.vehicleModel
          ? {
              identifier: vehicle.vehicleModel.identifier,
              name: vehicle.vehicleModel.name,
            }
          : null,
        colorOfVehicle: vehicle.colorOfVehicle,
        plateNumber: vehicle.plateNumber,
        seatCapacity: vehicle.seatCapacity,
        percentageShare: vehicle.percentageShare,
        createdAt: vehicle.createdAt,
      }))

      return response.status(HttpStatusCodesEnum.OK).send({
        status_code: HttpStatusCodesEnum.OK,
        status: SUCCESS,
        message: 'Investor vehicles fetched successfully',
        results: {
          investorVehicles: mutatedInvestorVehicles,
          paginationMeta,
        },
      })
    } catch (FetchInvestorVehiclesControllerError) {
      console.log('FetchInvestorVehiclesControllerError -> ', FetchInvestorVehiclesControllerError)
      await logApplicationError(FetchInvestorVehiclesControllerError)
      return response.status(HttpStatusCodesEnum.INTERNAL_SERVER_ERROR).send({
        status_code: HttpStatusCodesEnum.INTERNAL_SERVER_ERROR,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
