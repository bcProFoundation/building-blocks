import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CLIENT } from './client.schema';
import { Client } from '../interfaces/client.interface';
import { PaginateModel } from '../../typings/mongoose';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(CLIENT) private readonly clientModel: PaginateModel<Client>,
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

  async paginate(query, options) {
    return await this.clientModel.paginate(query, options);
  }

  async clear() {
    return await this.clientModel.deleteMany({});
  }

  async deleteClientsByUser(uuid) {
    return await this.clientModel.deleteMany({ createdBy: uuid });
  }

  getModel() {
    return this.clientModel;
  }
}
