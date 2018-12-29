import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CLIENT } from './client.schema';
import { Client } from '../interfaces/client.interface';
import { Model } from 'mongoose';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(CLIENT) private readonly clientModel: Model<Client>,
  ) {}

  async findOne(params) {
    return await this.clientModel.findOne(params);
  }

  async save(params) {
    const createdClient = new this.clientModel(params);
    return await createdClient.save();
  }

  async find(params) {
    return await this.clientModel
      .find(params, ['uuid', 'name', 'clientId'])
      .exec();
  }

  async clear() {
    return await this.clientModel.deleteMany({});
  }

  async deleteClientsByUser(uuid) {
    return await this.clientModel.deleteMany({ createdBy: uuid });
  }

  async deleteByUUID(uuid) {
    return await this.clientModel.deleteOne({ uuid });
  }

  async deleteByClientId(clientId) {
    return await this.clientModel.deleteOne({ clientId });
  }

  async update(query, doc) {
    return await this.clientModel.updateOne({ query }, doc);
  }

  getModel() {
    return this.clientModel;
  }
}
