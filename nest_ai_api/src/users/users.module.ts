import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './users/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  exports: [
    UsersService,
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
