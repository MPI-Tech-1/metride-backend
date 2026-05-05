import type CreateUserRecordOptions from '#model_management/type_checking/user/create_user_record_options'
import type ListUserRecordsOptions from '#model_management/type_checking/user/list_user_records_options'
import type UpdateUserRecordOptions from '#model_management/type_checking/user/update_user_record_options'
import type UserIdentifierOptions from '#model_management/type_checking/user/user_identifier_options'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'

export default class UserActions {
  public static async createUserRecord(
    createUserRecordOptions: CreateUserRecordOptions
  ): Promise<User> {
    const { createPayload, dbTransactionOptions } = createUserRecordOptions

    const user = new User()
    Object.assign(user, createPayload)

    if (dbTransactionOptions.useTransaction) {
      user.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await user.save()

    return user
  }

  private static async getUserByEmail(email: string): Promise<User | null> {
    return await User.query().where('email', email).first()
  }

  private static async getUserById(userId: number): Promise<User | null> {
    return await User.query().where('id', userId).first()
  }

  private static async getUser(getUserOptions: UserIdentifierOptions): Promise<User | null> {
    const { identifier, identifierType } = getUserOptions

    const GetUserIdentifierOptions: Record<string, Function> = {
      id: async () => await this.getUserById(Number(identifier)),

      email: async () => await this.getUserByEmail(String(identifier)),
    }

    return await GetUserIdentifierOptions[identifierType]()
  }

  public static async updateUserRecord(
    updateUserRecordOptions: UpdateUserRecordOptions
  ): Promise<User | null> {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateUserRecordOptions

    const user = await this.getUser(identifierOptions)

    if (user === null) return null

    Object.assign(user, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      user.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await user.save()

    return user
  }

  public static async listUsers(
    getUserRecordOptions: ListUserRecordsOptions
  ): Promise<{ userPayload: User[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = getUserRecordOptions

    const userQuery = User.query()

    if (filterRecordOptionsPayload?.searchQuery) {
      const searchValue = `${filterRecordOptionsPayload.searchQuery}%`

      userQuery.whereILike('full_name', searchValue).orWhereILike('email', searchValue)
    }

    if (paginationPayload) {
      const users = await userQuery
        .orderBy('created_at', 'desc')
        .paginate(paginationPayload.page, paginationPayload.limit)

      return {
        userPayload: users.all(),
        paginationMeta: users.getMeta(),
      }
    }

    const users = await userQuery.orderBy('created_at', 'desc')
    return {
      userPayload: users,
    }
  }

  public static async deleteUserAuthenticationToken(userId: number) {
    await db.from('auth_access_tokens').where('tokenable_id', userId).delete()
  }
}
