import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthData } from './auth-data.entity';

@Injectable()
export class AuthDataService {
  constructor(
    @InjectRepository(AuthData)
    private readonly authDataRepository: Repository<AuthData>,
  ) {}

  async save(authData) {
    return await this.authDataRepository.save(authData);
  }

  async findOne(params) {
    return await this.authDataRepository.findOne(params);
  }
}
