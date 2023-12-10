import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'

import { AuthService } from '../auth/auth.service'
import { AuthorizedUserDTO } from '../dtos'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('No token provided')
    }

    try {
      const user = await this.authService.validateUserToken(token)
      if (!user) {
        throw new UnauthorizedException('Invalid token')
      }

      request.user = new AuthorizedUserDTO()
      request.user.userId = user.id // Assuming your validateUserToken returns user object with id
      // Populate other properties of AuthorizedUserDTO if needed

      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
