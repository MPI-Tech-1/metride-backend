import type UpdateRecordGeneric from '#common/type_checkings/model_management/update_record_generic'
import type InvestorVehicleIdentifierOptions from '#model_management/type_checking/investor_vehicle/investor_vehicle_identifier_options'
import type InvestorVehicleInterface from '#model_management/type_checking/investor_vehicle/investor_vehicle_interface'

type UpdateInvestorVehicleRecordOptions = UpdateRecordGeneric<
  InvestorVehicleIdentifierOptions,
  Partial<InvestorVehicleInterface>
>

export default UpdateInvestorVehicleRecordOptions
