import { SERVICE_PROVIDER_NOT_PROFILED } from '#common/messages/system_messages'
import CloudinaryMediaUploadProvider from '#infrastructure_providers/externals/media_upload/cloudinary_media_upload_provider'
import type MediaUploadInterface from '#infrastructure_providers/type_checkings/media_upload/media_upload_interface'

export default class MediaUploadFactory {
  constructor(private provider: string) {}

  public build(): MediaUploadInterface | string {
    if (this.provider === 'cloudinary') return new CloudinaryMediaUploadProvider()

    return SERVICE_PROVIDER_NOT_PROFILED
  }
}
