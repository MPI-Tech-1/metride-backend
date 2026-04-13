import CreateAdminRecordOptions from '#model_management/type_checking/admin/create_admin_record_options'
import ListAdminRecordsOptions from '#model_management/type_checking/admin/list_admin_records_options'
import UpdateAdminRecordOptions from '#model_management/type_checking/admin/update_admin_record_options'
import AdminIdentifierOptions from '#model_management/type_checking/admin/admin_identifier_options'
import Admin from '#models/admin'
import db from '@adonisjs/lucid/services/db'

export default class AdminActions {
  public static async createAdminRecord(
    createAdminRecordOptions: CreateAdminRecordOptions
  ): Promise<Admin> {
    const { createPayload, dbTransactionOptions } = createAdminRecordOptions

    const admin = new Admin()
    Object.assign(admin, createPayload)

    if (dbTransactionOptions.useTransaction) {
      admin.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await admin.save()

    return admin
  }

  public static async getAdminByEmail(email: string): Promise<Admin | null> {
    return await Admin.query().where('email', email).first()
  }

  public static async getAdminById(adminId: number): Promise<Admin | null> {
    return await Admin.query().where('id', adminId).first()
  }

  public static async getAdminByIdentifier(adminIdentifier: string): Promise<Admin | null> {
    return await Admin.query().where('identifier', adminIdentifier).first()
  }

  public static async getAdmin(
    getAdminOptions: AdminIdentifierOptions
  ): Promise<Admin | null> {
    const { identifier, identifierType } = getAdminOptions

    const GetAdminIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getAdminById(Number(identifier)),

      identifier: async () => await this.getAdminByIdentifier(String(identifier)),

      email: async () => await this.getAdminByEmail(String(identifier)),
    }

    return await GetAdminIdentifierOptions[identifierType]()
  }

  public static async updateAdminRecord(
    updateAdminRecordOptions: UpdateAdminRecordOptions
  ): Promise<Admin | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateAdminRecordOptions

    const admin = await this.getAdmin(identifierOptions)

    if (admin === null) return null

    Object.assign(admin, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      admin.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await admin.save()

    return admin
  }

  public static async listAdmins(
    getAdminRecordOptions: ListAdminRecordsOptions
  ): Promise<{ adminPayload: Admin[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getAdminRecordOptions

    const adminQuery = Admin.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      adminQuery
        .whereILike('first_name', searchValue)
        .orWhereILike('last_name', searchValue)
        .orWhereILike('email', searchValue)
    }

    if (paginationPayload) {
      const admins = await adminQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        adminPayload: admins.all(),
        paginationMeta: admins.getMeta(),
      }
    }

    const admins = await adminQuery.orderBy('created_at', 'desc')
    return {
      adminPayload: admins,
    }
  }

  public static async deleteAdminAuthenticationToken(adminId: number) {
    await db.from('auth_access_tokens').where('tokenable_id', adminId).delete()
  }
}
