import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async create(user) {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findOne(params): Promise<any> {
    return await this.userRepository.findOne(params);
  }

  public async delete(params): Promise<any> {
    return await this.findOne(params).then(user =>
      user
        .remove()
        .then(() => Promise.resolve({ message: 'user has been deleted' })),
    );
  }
}
