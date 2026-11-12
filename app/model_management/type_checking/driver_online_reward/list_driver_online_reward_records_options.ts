import type ListRecordsGeneric from '#common/type_checkings/model_management/list_records_generic'

type ListDriverOnlineRewardRecordsFilterOptions = {
  driverId?: number
  rewardDate?: string
}

type ListDriverOnlineRewardRecordsOptions =
  ListRecordsGeneric<ListDriverOnlineRewardRecordsFilterOptions>

export default ListDriverOnlineRewardRecordsOptions
