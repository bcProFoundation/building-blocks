import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { TokenCache } from './token-cache.entity';

@Injectable()
export class TokenCacheService {
  constructor(
    @InjectRepository(TokenCache)
    private readonly tokenCacheRepository: MongoRepository<TokenCache>,
  ) {}

  async save(params) {
    return await this.tokenCacheRepository.save(params);
  }

  async find(): Promise<TokenCache[]> {
    return await this.tokenCacheRepository.find();
  }

  async findOne(params) {
    return await this.tokenCacheRepository.findOne(params);
  }

  async update(query, params) {
    return await this.tokenCacheRepository.update(query, params);
  }

  async count() {
    return await this.tokenCacheRepository.count();
  }

  async paginate(skip: number, take: number) {
    return await this.tokenCacheRepository.find({ skip, take });
  }
}
