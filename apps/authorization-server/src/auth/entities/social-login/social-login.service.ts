import { Injectable, Inject } from '@nestjs/common';
import { SOCIAL_LOGIN } from './social-login.schema';
import { Model } from 'mongoose';
import { SocialLogin } from './social-login.interface';

@Injectable()
export class SocialLoginService {
  constructor(
    @Inject(SOCIAL_LOGIN)
    private readonly socialLoginModel: Model<SocialLogin>,
  ) {}

  async save(params) {
    const createdScope = new this.socialLoginModel(params);
    return await createdScope.save();
  }

  async findOne(params) {
    return await this.socialLoginModel.findOne(params);
  }

  public async clear() {
    return await this.socialLoginModel.deleteMany({});
  }

  public async find(params) {
    return await this.socialLoginModel.find(params);
  }

  async remove(socialLogin: SocialLogin) {
    return await socialLogin.remove();
  }

  async getAllWithClientId() {
    return await this.socialLoginModel.where('clientId').ne(null);
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
      query.$or = Object.keys(this.socialLoginModel.schema.obj).map(field => {
        const out = {};
        out[field] = nameExp;
        return out;
      });
    }

    const data = this.socialLoginModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortQuery);

    return {
      docs: await data.exec(),
      length: await this.socialLoginModel.countDocuments(query),
      offset: Number(offset),
    };
  }
}
