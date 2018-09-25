import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CLIENT } from './client.schema';
import { Client } from '../interfaces/client.interface';

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

  async find() {
    return await this.clientModel.find().exec();
  }

  async clear() {
    return await this.clientModel.deleteMany({});
  }

  getModel() {
    return this.clientModel;
  }
}
