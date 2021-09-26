import { Injectable, Inject } from '@nestjs/common';
import { CLIENT } from './client.schema';
import { Client } from './client.interface';
import { Model } from 'mongoose';

@Injectable()
export class ClientService {
  constructor(@Inject(CLIENT) private readonly clientModel: Model<Client>) {}

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

  async findAll(params?): Promise<Client[]> {
    return await this.clientModel.find(params).exec();
  }

  async clear(): Promise<any> {
    return await this.clientModel.deleteMany({});
  }

  async deleteClientsByUser(uuid): Promise<any> {
    return await this.clientModel.deleteMany({ createdBy: uuid, isTrusted: 0 });
  }

  async deleteByUUID(uuid): Promise<any> {
    return await this.clientModel.deleteOne({ uuid });
  }

  async deleteByClientId(clientId): Promise<any> {
    return await this.clientModel.deleteOne({ clientId });
  }

  async updateOne(query, params): Promise<any> {
    return await this.clientModel.updateOne(query, params);
  }

  async list(
    search: string,
    query: any,
    sortQuery?: any,
    offset: number = 0,
    limit: number = 20,
  ) {
    if (search) {
      // Search through multiple keys
      // https://stackoverflow.com/a/41390870
      const nameExp = new RegExp(search, 'i');
      query.$or = ['name', 'clientId', 'uuid'].map(field => {
        const out = {};
        out[field] = nameExp;
        return out;
      });
    }

    const data = this.clientModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortQuery);

    return {
      docs: await data.exec(),
      length: await this.clientModel.countDocuments(query),
      offset: Number(offset),
    };
  }
}
