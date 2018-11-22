import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueLog } from './queue-log.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class QueueLogService {
  constructor(
    @InjectRepository(QueueLog)
    private readonly queueLogRepository: MongoRepository<QueueLog>,
  ) {}

  async save(params) {
    return await this.queueLogRepository.save(params);
  }

  async findOne(params) {
    return await this.queueLogRepository.findOne(params);
  }

  async find() {
    return await this.queueLogRepository.find();
  }
}
