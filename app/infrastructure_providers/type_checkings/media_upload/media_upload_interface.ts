import { type MultipartFile } from '@adonisjs/core/bodyparser'

export type UploadedMedia = {
  url: string
}

export type UploadImageOptions = {
  file: MultipartFile
  folder?: string
}

interface MediaUploadInterface {
  uploadImage(uploadImageOptions: UploadImageOptions): Promise<UploadedMedia>
}

export default MediaUploadInterface
