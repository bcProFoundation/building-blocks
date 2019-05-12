import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { OAuth2Token } from './oauth2-token.entity';

@Injectable()
export class OAuth2TokenService {
  constructor(
    @InjectRepository(OAuth2Token)
    private readonly oauth2TokenRepository: MongoRepository<OAuth2Token>,
  ) {}

  async save(params) {
    return await this.oauth2TokenRepository.save(params);
  }

  async find(): Promise<OAuth2Token[]> {
    return await this.oauth2TokenRepository.find();
  }

  async findOne(params) {
    return await this.oauth2TokenRepository.findOne(params);
  }

  async update(query, params) {
    return await this.oauth2TokenRepository.update(query, params);
  }

  async count() {
    return await this.oauth2TokenRepository.count();
  }

  async paginate(skip: number, take: number) {
    return await this.oauth2TokenRepository.find({ skip, take });
  }
}
