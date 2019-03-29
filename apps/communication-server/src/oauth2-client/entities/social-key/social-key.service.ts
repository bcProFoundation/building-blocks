import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { SocialKey } from './social-key.entity';

@Injectable()
export class SocialKeyService {
  constructor(
    @InjectRepository(SocialKey)
    private readonly socialKeyRepository: MongoRepository<SocialKey>,
  ) {}

  async save(params) {
    return await this.socialKeyRepository.save(params);
  }

  async find(): Promise<SocialKey[]> {
    return await this.socialKeyRepository.find();
  }

  async findOne(params) {
    return await this.socialKeyRepository.findOne(params);
  }

  async update(query, params) {
    return await this.socialKeyRepository.update(query, params);
  }

  async count() {
    return await this.socialKeyRepository.count();
  }

  async paginate(skip: number, take: number) {
    return await this.socialKeyRepository.find({ skip, take });
  }
}
