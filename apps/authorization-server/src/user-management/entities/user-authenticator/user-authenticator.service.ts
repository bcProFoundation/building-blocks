import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_AUTHENTICATOR } from './user-authenticator.schema';
import { UserAuthenticator } from './user-authenticator.interface';

@Injectable()
export class UserAuthenticatorService {
  constructor(
    @Inject(USER_AUTHENTICATOR)
    private readonly userAuthenticatorModel: Model<UserAuthenticator>,
  ) {}

  async save(params) {
    const createdAuthenticator = new this.userAuthenticatorModel(params);
    return await createdAuthenticator.save();
  }

  async findOne(params) {
    return await this.userAuthenticatorModel.findOne(params);
  }

  async clear(): Promise<any> {
    return await this.userAuthenticatorModel.deleteMany({});
  }

  async find(params?) {
    return await this.userAuthenticatorModel.find(params).exec();
  }

  async remove(authenticator: UserAuthenticator) {
    return await authenticator.remove();
  }

  async list(
    offset: number,
    limit: number,
    search: string,
    query: any,
    sortQuery?: any,
  ) {
    if (search) {
      // Search through multiple keys
      // https://stackoverflow.com/a/41390870
      const nameExp = new RegExp(search, 'i');
      query.$or = ['name', 'uuid'].map(field => {
        const out = {};
        out[field] = nameExp;
        return out;
      });
    }

    const data = this.userAuthenticatorModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortQuery);

    return {
      docs: await data.exec(),
      length: await this.userAuthenticatorModel.countDocuments(query),
      offset: Number(offset),
    };
  }

  async deleteMany(params): Promise<any> {
    return await this.userAuthenticatorModel.deleteMany(params);
  }

  async updateOne(query, params): Promise<any> {
    return await this.userAuthenticatorModel.updateOne(query, params);
  }
}
