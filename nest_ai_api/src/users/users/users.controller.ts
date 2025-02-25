import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  index(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Post('create')
  async create(@Body() entitytData: UserEntity): Promise<any> {
    return this.usersService.create(entitytData);
  }

  @Put(':id/update')
  async update(@Param('id') id, @Body() entityData: UserEntity): Promise<any> {
      entityData.id = Number(id);
      return this.usersService.update(entityData);
  }

  @Delete(':id/delete')
    async delete(@Param('id') id): Promise<any> {
      return this.usersService.delete(id);
  }  
}
