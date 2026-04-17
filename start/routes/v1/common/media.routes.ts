import router from '@adonisjs/core/services/router'

const UploadImageController = () => import('#controllers/v1/common/media/upload_image_controller')

router
  .group(() => {
    router.post('/image', [UploadImageController])
  })
  .prefix('/api/v1/common/media')
  .as('common.media')
