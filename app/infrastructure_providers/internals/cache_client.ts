import {
  CACHE_DATA_DOES_NOT_EXIST,
  CACHE_DATA_EXISTS,
  CACHE_DATA_WAS_NOT_SAVED,
  CACHE_DATA_WAS_SAVED,
  CACHE_DATA_WAS_NOT_REMOVED,
  CACHE_DATA_WAS_REMOVED,
} from '#common/messages/system_messages'
import cache from '@adonisjs/cache/services/main'
import cacheConfig from '#config/cache'

type CachePayloadOptionsType = {
  /**
   * The Cache Identifier
   */
  cacheKey: string

  /**
   * The Data to be saved in the Cache
   */
  cacheData: any

  /**
   * The shelf life of the Cached Data, defaults to 1 hour
   */
  cacheDuration?: number
}

class CacheClient {
  /**
   * @description Cache Data Validity in Seconds
   * @author IAM
   * @static
   * @memberof CacheClient
   */
  public static cacheShelfLife = cacheConfig.ttl

  /**
   * @description Check if the data exists in the cache using its key
   * @author IAM
   * @static
   * @param {string} cacheKey The identifier of the cache record
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async checkIfDataExists(cacheKey: string): Promise<string> {
    const dataExists = await cache.use('redis').has({ key: cacheKey })

    if (dataExists === false) {
      return CACHE_DATA_DOES_NOT_EXIST
    }

    return CACHE_DATA_EXISTS
  }

  /**
   * @description Save a single dataset to the Cache
   * @author IAM
   * @static
   * @param {CachePayloadOptionsType} cachePayload { cacheKey | cacheData | cacheDuration }
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async saveToCache(cachePayload: CachePayloadOptionsType): Promise<string> {
    const { cacheKey, cacheData, cacheDuration = CacheClient.cacheShelfLife } = cachePayload

    const saveOutcome = await cache
      .use('redis')
      .set({ key: cacheKey, value: cacheData, ttl: cacheDuration })

    if (saveOutcome === false) {
      return CACHE_DATA_WAS_NOT_SAVED
    }

    return CACHE_DATA_WAS_SAVED
  }

  /**
   * @description Retrieve a single dataset from the Cache
   * @author IAM
   * @static
   * @param {string} cacheKey The identifier of the cache record
   * @returns {*}
   * @memberof CacheClient
   */
  public static async fetchData(cacheKey: string): Promise<any> {
    const fetchDataOutcome = await cache.use('redis').get({ key: cacheKey })

    if (fetchDataOutcome === undefined || fetchDataOutcome === null) {
      return CACHE_DATA_DOES_NOT_EXIST
    }

    return fetchDataOutcome
  }

  /**
   * @description Remove a single dataset from the Cache
   * @author IAM
   * @static
   * @param {string} cacheKey The identifier of the cache record
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async removeSingleRecord(cacheKey: string): Promise<string> {
    const deleteOutcome = await cache.use('redis').delete({ key: cacheKey })
    if (deleteOutcome === false) {
      return CACHE_DATA_WAS_NOT_REMOVED
    }

    return CACHE_DATA_WAS_REMOVED
  }

  /**
   * @description Fetch data if available, retrieve and save to key if unavailable
   * @author IAM
   * @static
   * @param {Record<string, any>} cacheRetrievalOptions { cacheKey - record key | retrievedData - callback function }
   * @returns {*}  {Promise<any>}
   * @memberof CacheClient
   */
  public static async fetchOrSave(cacheRetrievalOptions: Record<string, any>): Promise<any> {
    const { cacheKey, retrievedData } = cacheRetrievalOptions
    const outcome = await cache.use('redis').getOrSet({
      key: cacheKey,
      factory: async () => await retrievedData,
    })
    return outcome
  }

  /**
   * @description Empty the Cache
   * @author IAM
   * @static
   * @returns {*}  {Promise<string>}
   * @memberof CacheClient
   */
  public static async emptyCache(): Promise<void> {
    await cache.use('redis').clear()
  }
}

export default CacheClient
