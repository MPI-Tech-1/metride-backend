import type CreateDriverOnlineRewardRecordOptions from '#model_management/type_checking/driver_online_reward/create_driver_online_reward_record_options'
import type ListDriverOnlineRewardRecordsOptions from '#model_management/type_checking/driver_online_reward/list_driver_online_reward_records_options'
import DriverOnlineReward from '#models/driver_online_reward'

export default class DriverOnlineRewardActions {
  public static async createDriverOnlineRewardRecord(
    createDriverOnlineRewardRecordOptions: CreateDriverOnlineRewardRecordOptions
  ): Promise<DriverOnlineReward> {
    const { createPayload, dbTransactionOptions } = createDriverOnlineRewardRecordOptions

    const driverOnlineReward = new DriverOnlineReward()
    Object.assign(driverOnlineReward, createPayload)

    if (dbTransactionOptions.useTransaction) {
      driverOnlineReward.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverOnlineReward.save()

    return driverOnlineReward
  }

  /** Driver ids already rewarded on `rewardDate` (ISO date, Lagos). */
  public static async listRewardedDriverIdsForDate(rewardDate: string): Promise<Set<number>> {
    const rewards = await DriverOnlineReward.query()
      .where('reward_date', rewardDate)
      .select('driver_id')
    return new Set(rewards.map((reward) => reward.driverId))
  }

  public static async listDriverOnlineRewards(
    listDriverOnlineRewardRecordsOptions: ListDriverOnlineRewardRecordsOptions
  ): Promise<{ driverOnlineRewardPayload: DriverOnlineReward[]; paginationMeta?: any }> {
    const { filterRecordOptionsPayload, paginationPayload } = listDriverOnlineRewardRecordsOptions

    const query = DriverOnlineReward.query().preload('driver')

    if (filterRecordOptionsPayload?.driverId !== undefined) {
      query.where('driver_id', filterRecordOptionsPayload.driverId)
    }
    if (filterRecordOptionsPayload?.rewardDate) {
      query.where('reward_date', filterRecordOptionsPayload.rewardDate)
    }

    query.orderBy('reward_date', 'desc').orderBy('id', 'desc')

    if (paginationPayload) {
      const rewards = await query.paginate(paginationPayload.page, paginationPayload.limit)
      return { driverOnlineRewardPayload: rewards.all(), paginationMeta: rewards.getMeta() }
    }

    return { driverOnlineRewardPayload: await query }
  }
}
