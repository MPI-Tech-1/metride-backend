import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import mediaUploadConfig from '#config/media_upload_config'
import MediaUploadFactory from '#infrastructure_providers/factories/media_upload_factory'
import type MediaUploadInterface from '#infrastructure_providers/type_checkings/media_upload/media_upload_interface'

export default function configureMediaUploadProvider(): MediaUploadInterface {
  const provider = new MediaUploadFactory(mediaUploadConfig.currentProvider).build()

  if (provider === SERVICE_PROVIDER_NOT_PROFILED) {
    throw new Error(SERVICE_PROVIDER_NOT_PROFILED)
  }

  return provider as MediaUploadInterface
}
