import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationCode } from './authorization-code.entity';

@Injectable()
export class AuthorizationCodeService {
  constructor(
    @InjectRepository(AuthorizationCode)
    private readonly authorizationCodeRepository: Repository<AuthorizationCode>,
  ) {}

  async save(params) {
    return await this.authorizationCodeRepository.save(params);
  }

  async findOne(params) {
    return await this.authorizationCodeRepository.findOne(params);
  }

  async delete(params) {
    return await this.authorizationCodeRepository.delete(params);
  }

  async clear() {
    return await this.authorizationCodeRepository.clear();
  }
}
