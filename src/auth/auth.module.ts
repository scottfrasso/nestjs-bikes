import { Module } from '@nestjs/common'

import { AuthService } from './auth.service'
import { DataModule } from '../data'

@Module({
  imports: [DataModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
