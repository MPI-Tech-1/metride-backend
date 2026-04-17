import { v2 as cloudinary } from 'cloudinary'
import mediaUploadConfig from '#config/media_upload_config'
import MediaUploadInterface, {
  UploadedMedia,
  UploadImageOptions,
} from '#infrastructure_providers/type_checkings/media_upload/media_upload_interface'

export default class CloudinaryMediaUploadProvider implements MediaUploadInterface {
  constructor() {
    cloudinary.config({
      cloud_name: mediaUploadConfig.cloudinary.cloudName,
      api_key: mediaUploadConfig.cloudinary.apiKey,
      api_secret: mediaUploadConfig.cloudinary.apiSecret.release(),
    })
  }
  public async uploadImage(uploadImageOptions: UploadImageOptions): Promise<UploadedMedia> {
    const { folder = 'general', file } = uploadImageOptions

    const result = await cloudinary.uploader.upload(file.tmpPath!, {
      folder: folder ?? mediaUploadConfig.cloudinary.defaultFolder,
    })

    return {
      url: result.secure_url,
    }
  }
}
