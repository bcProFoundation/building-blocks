import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async update(query, params) {
    return await this.sessionRepository.update(query, params);
  }

  async save(params) {
    return await this.sessionRepository.save(params);
  }

  async find() {
    return await this.sessionRepository.find();
  }

  async delete(params) {
    return await this.sessionRepository.delete(params);
  }

  async clear() {
    return await this.sessionRepository.clear();
  }

  async count() {
    return await this.sessionRepository.count();
  }

  async findOne(params) {
    return await this.sessionRepository.findOne(params);
  }
}
