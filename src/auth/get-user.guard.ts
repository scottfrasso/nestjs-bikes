import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { AuthorizedUserDTO } from '../dtos'

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as AuthorizedUserDTO
  },
)
