import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CLIENT } from './client.schema';
import { Client } from '../interfaces/client.interface';
import { Model } from 'mongoose';
import { AUTHORIZATION } from '../../constants/app-strings';

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

  async verifyChangedSecret(req) {
    const authorizationHeader = req.headers[AUTHORIZATION];
    try {
      const basicAuthHeader = authorizationHeader.split(' ')[1];
      const [clientId, changedClientSecret] = Buffer.from(
        basicAuthHeader,
        'base64',
      )
        .toString()
        .split(':');
      const client = await this.findOne({ clientId });
      if (client.changedClientSecret === changedClientSecret) {
        client.clientSecret = changedClientSecret;
        client.modified = new Date();
        await client.save();
        delete client.changedClientSecret;
        await this.clientModel.updateOne(
          { clientId },
          { $unset: { changedClientSecret: 1 } },
        );
        return client;
      } else throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  getModel() {
    return this.clientModel;
  }
}
