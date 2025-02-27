import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';;
import { UserEntity } from './user.entity'
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) { }

  async findAll(): Promise<UserEntity[]> {
    var users =  await this.userRepository.find();
    return users;// plainToInstance(UserEntity, users, { excludeExtraneousValues: true });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    var user =  await this.userRepository.findOne({ 
      where: {
        normalizedEmail: email.trim().toUpperCase()
      }
    });

    return user; // plainToInstance(UserEntity, user, { excludeExtraneousValues: true });
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(entity);
  }

  async update(entity: UserEntity): Promise<UpdateResult> {
    return await this.userRepository.update(entity.id, entity)
  }

  async delete(id): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }
}
