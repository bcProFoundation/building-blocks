import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { OAuth2Provider } from './oauth2-provider.entity';

@Injectable()
export class OAuth2ProviderService {
  constructor(
    @InjectRepository(OAuth2Provider)
    private readonly oauth2ProviderRepository: MongoRepository<OAuth2Provider>,
  ) {}

  async save(params) {
    return await this.oauth2ProviderRepository.save(params);
  }

  async find(): Promise<OAuth2Provider[]> {
    return await this.oauth2ProviderRepository.find();
  }

  async findOne(params) {
    return await this.oauth2ProviderRepository.findOne(params);
  }

  async update(query, params) {
    return await this.oauth2ProviderRepository.update(query, params);
  }

  async count() {
    return await this.oauth2ProviderRepository.count();
  }

  async list(skip: number, take: number) {
    const providers = await this.oauth2ProviderRepository.find({ skip, take });
    return {
      docs: providers,
      length: await this.oauth2ProviderRepository.count(),
      offset: skip,
    };
  }
}
