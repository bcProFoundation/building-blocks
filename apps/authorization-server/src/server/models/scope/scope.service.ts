import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scope } from './scope.entity';

@Injectable()
export class ScopeService {
  constructor(
    @InjectRepository(Scope)
    private readonly scopeRepository: Repository<Scope>,
  ) {}

  async save(params) {
    return await this.scopeRepository.save(params);
  }

  async findOne(params) {
    return await this.scopeRepository.findOne(params);
  }

  public async clear() {
    return await this.scopeRepository.clear();
  }
}
