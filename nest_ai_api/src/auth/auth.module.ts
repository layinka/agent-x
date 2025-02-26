import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { EncryptionModule } from 'src/encryption/encryption.module';

@Module({
  imports: [
    UsersModule,
    EncryptionModule
  ],
  providers: [
    AuthService
  
  ],
  controllers: [AuthController]
})
export class AuthModule {}
