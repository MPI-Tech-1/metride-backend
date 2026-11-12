import type DriverOnlineRewardSetting from '#models/driver_online_reward_setting'
import { DRIVER_ONLINE_REWARD_TIMEZONE } from '#services/driver_online_reward_service'

export default function serializeDriverOnlineRewardSetting(setting: DriverOnlineRewardSetting) {
  return {
    isEnabled: setting.isEnabled,
    windowStartTime: setting.windowStartTime,
    windowEndTime: setting.windowEndTime,
    timezone: DRIVER_ONLINE_REWARD_TIMEZONE,
    rewardAmount: setting.rewardAmount,
    graceMinutes: setting.graceMinutes,
    acceptanceTimeoutMinutes: setting.acceptanceTimeoutMinutes,
    updatedAt: setting.updatedAt,
  }
}
