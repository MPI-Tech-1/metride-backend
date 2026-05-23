import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AdminRoleEnum from '#common/enums/admin_role_enum'
import HttpStatusCodesEnum from '#common/enums/http_status_codes_enum'
import { ERROR } from '#common/messages/system_messages'

export default class AdminRoleMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { roles: AdminRoleEnum[] } = { roles: [] }
  ) {
    const admin = ctx.auth.user as { role: AdminRoleEnum } | undefined

    if (!admin || !options.roles.includes(admin.role)) {
      return ctx.response.status(HttpStatusCodesEnum.FORBIDDEN).send({
        status_code: HttpStatusCodesEnum.FORBIDDEN,
        status: ERROR,
        message: 'You do not have permission to access this resource.',
      })
    }

    return next()
  }
}
