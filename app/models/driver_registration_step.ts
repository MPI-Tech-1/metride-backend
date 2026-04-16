import { column } from '@adonisjs/lucid/orm'
import AbstractModel from '#models/abstract_model'

export default class DriverRegistrationStep extends AbstractModel {
  @column()
  declare driverId: number

  @column({ consume: (value) => value === 1 })
  declare hasActivatedAccount: boolean

  @column({ consume: (value) => value === 1 })
  declare hasProvidedPersonalInformation: boolean

  @column({ consume: (value) => value === 1 })
  declare hasProvidedVehicleInformation: boolean

  @column({ consume: (value) => value === 1 })
  declare hasProvidedRequiredDocuments: boolean
}
