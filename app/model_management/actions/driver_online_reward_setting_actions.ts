import type UpdateDriverOnlineRewardSettingRecordOptions from '#model_management/type_checking/driver_online_reward_setting/update_driver_online_reward_setting_record_options'
import DriverOnlineRewardSetting from '#models/driver_online_reward_setting'

export default class DriverOnlineRewardSettingActions {
  /**
   * There is a single, global settings row. It is seeded by the migration; if it
   * is missing it is recreated with safe (disabled) defaults.
   */
  public static async getDriverOnlineRewardSetting(): Promise<DriverOnlineRewardSetting> {
    const existingSetting = await DriverOnlineRewardSetting.query().orderBy('id', 'asc').first()
    if (existingSetting) return existingSetting

    const driverOnlineRewardSetting = new DriverOnlineRewardSetting()
    driverOnlineRewardSetting.merge({
      isEnabled: false,
      windowStartTime: '07:00',
      windowEndTime: '09:00',
      rewardAmount: 0,
      graceMinutes: 5,
      acceptanceTimeoutMinutes: 5,
    })
    await driverOnlineRewardSetting.save()
    return driverOnlineRewardSetting
  }

  public static async updateDriverOnlineRewardSettingRecord(
    updateDriverOnlineRewardSettingRecordOptions: Omit<
      UpdateDriverOnlineRewardSettingRecordOptions,
      'identifierOptions'
    >
  ): Promise<DriverOnlineRewardSetting> {
    const { updatePayload, dbTransactionOptions } = updateDriverOnlineRewardSettingRecordOptions

    const driverOnlineRewardSetting = await this.getDriverOnlineRewardSetting()
    Object.assign(driverOnlineRewardSetting, updatePayload)

    if (dbTransactionOptions.useTransaction) {
      driverOnlineRewardSetting.useTransaction(dbTransactionOptions.dbTransaction)
    }
    await driverOnlineRewardSetting.save()

    return driverOnlineRewardSetting
  }
}
