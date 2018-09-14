import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { Repository } from 'typeorm';
import { clientNotSetupException } from 'constants/exceptions';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async update(query, params) {
    return await this.clientRepository.update(query, params);
  }

  async save(params) {
    return await this.clientRepository.save(params);
  }

  async find() {
    return await this.clientRepository.find();
  }

  async delete(params) {
    return await this.clientRepository.delete(params);
  }

  async clear() {
    return await this.clientRepository.clear();
  }

  async count() {
    return await this.clientRepository.count();
  }

  async findOne(params) {
    return await this.clientRepository.findOne(params);
  }

  async getClient() {
    const clients = await this.clientRepository.find();
    if (!clients.length) throw clientNotSetupException;
    const client = clients[0];
    return client;
  }
}
