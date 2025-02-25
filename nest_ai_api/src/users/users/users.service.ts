import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { UpdateResult, DeleteResult } from 'typeorm';;
import { UserEntity } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) { }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ 
      where: {
        normalizedEmail: email.toUpperCase()
      }
    });
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
