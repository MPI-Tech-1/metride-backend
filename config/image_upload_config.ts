import env from '#start/env'

const imageUploadConfig = {
  currentProvider: env.get('CURRENT_MEDIA_UPLOAD_PROVIDER'),
  cloudinary: {
    cloudName: env.get('CLOUDINARY_CLOUD_NAME'),
    apiKey: env.get('CLOUDINARY_API_KEY'),
    apiSecret: env.get('CLOUDINARY_API_SECRET'),
    defaultFolder: env.get('CLOUDINARY_DEFAULT_FOLDER'),
  },
}

export default imageUploadConfig
