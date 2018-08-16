import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BearerToken } from './bearer-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BearerTokenService {
  constructor(
    @InjectRepository(BearerToken)
    private readonly bearerTokenRepository: Repository<BearerToken>,
  ) {}
  async save(params) {
    return await this.bearerTokenRepository.save(params);
  }
  async findOne(params) {
    return await this.bearerTokenRepository.findOne(params);
  }

  async find(params) {
    return await this.bearerTokenRepository.find(params);
  }

  async clear() {
    return await this.bearerTokenRepository.clear();
  }
}
