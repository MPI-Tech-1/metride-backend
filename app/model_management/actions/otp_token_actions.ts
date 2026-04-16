import CreateOtpTokenRecordOptions from '#model_management/type_checking/otp_token/create_otp_token_record_options'
import ListOtpTokenRecordsOptions from '#model_management/type_checking/otp_token/list_otp_token_records_options'
import UpdateOtpTokenRecordOptions from '#model_management/type_checking/otp_token/update_otp_token_record_options'
import OtpTokenIdentifierOptions from '#model_management/type_checking/otp_token/otp_token_identifier_options'
import OtpToken from '#models/otp_token'

export default class OtpTokenActions {
  public static async createOtpTokenRecord(
    createOtpTokenRecordOptions: CreateOtpTokenRecordOptions
  ): Promise<OtpToken> {
    const { createPayload, dbTransactionOptions } = createOtpTokenRecordOptions

    const otpToken = new OtpToken()
    Object.assign(otpToken, createPayload)

    if (dbTransactionOptions.useTransaction) {
      otpToken.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await otpToken.save()

    return otpToken
  }

  public static async getOtpTokenById(id: number): Promise<OtpToken | null> {
    return await OtpToken.query().where('id', id).first()
  }

  public static async getOtpTokenByIdentifier(identifier: string): Promise<OtpToken | null> {
    return await OtpToken.query().where('identifier', identifier).first()
  }

  public static async getOtpTokenByEmailAddress(email: string): Promise<OtpToken | null> {
    return await OtpToken.query()
      .where('email', email)
      .where('status', 'pending')

      .orderBy('created_at', 'desc')
      .first()
  }

  public static async getOtpToken(
    getOtpTokenOptions: OtpTokenIdentifierOptions
  ): Promise<OtpToken | null> {
    const { identifier, identifierType } = getOtpTokenOptions

    const GetOtpTokenIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getOtpTokenById(Number(identifier)),

      identifier: async () => await this.getOtpTokenByIdentifier(String(identifier)),

      email: async () => await this.getOtpTokenByEmailAddress(String(identifier)),
    }

    return await GetOtpTokenIdentifierOptions[identifierType]()
  }

  public static async updateOtpTokenRecord(
    updateOtpTokenRecordOptions: UpdateOtpTokenRecordOptions
  ): Promise<OtpToken | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateOtpTokenRecordOptions

    const otpToken = await this.getOtpToken(identifierOptions)

    if (otpToken === null) return null

    Object.assign(otpToken, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      otpToken.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await otpToken.save()

    return otpToken
  }

  public static async listOtpTokens(
    listOtpTokenRecordsOptions: ListOtpTokenRecordsOptions
  ): Promise<{ otpTokenPayload: OtpToken[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = listOtpTokenRecordsOptions

    const otpTokenQuery = OtpToken.query()

    if (filterRecordOptionsPayload?.email) {
      otpTokenQuery.where('email', filterRecordOptionsPayload.email)
    }

    if (filterRecordOptionsPayload?.purpose) {
      otpTokenQuery.where('purpose', filterRecordOptionsPayload.purpose)
    }

    if (filterRecordOptionsPayload?.status) {
      otpTokenQuery.where('status', filterRecordOptionsPayload.status)
    }

    if (paginationPayload) {
      const otpTokens = await otpTokenQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        otpTokenPayload: otpTokens.all(),
        paginationMeta: otpTokens.getMeta(),
      }
    }

    const otpTokens = await otpTokenQuery.orderBy('created_at', 'desc')
    return {
      otpTokenPayload: otpTokens,
    }
  }
}
