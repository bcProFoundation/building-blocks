import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async findOne(params) {
    return await this.clientRepository.findOne(params);
  }

  async save(params) {
    return await this.clientRepository.save(params);
  }
}
