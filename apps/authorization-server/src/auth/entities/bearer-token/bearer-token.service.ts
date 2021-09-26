import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { BEARER_TOKEN } from './bearer-token.schema';
import { BearerToken } from './bearer-token.interface';
import { i18n } from '../../../i18n/i18n.config';

@Injectable()
export class BearerTokenService {
  constructor(
    @Inject(BEARER_TOKEN)
    private readonly bearerTokenModel: Model<BearerToken>,
  ) {}
  async save(params) {
    // Check unique
    const checkAccessToken = await this.findOne({
      accessToken: params.accessToken,
    });

    let checkRefreshToken;
    if (params.refreshToken) {
      checkRefreshToken = await this.findOne({
        refreshToken: params.refreshToken,
      });
    }

    if (checkAccessToken || checkRefreshToken) {
      throw new HttpException(
        i18n.__('Invalid Bearer Token'),
        HttpStatus.NOT_FOUND,
      );
    }

    const createdToken = new this.bearerTokenModel(params);
    return await createdToken.save();
  }
  async findOne(params) {
    return await this.bearerTokenModel.findOne(params);
  }

  async find(params) {
    return await this.bearerTokenModel.find(params);
  }

  async clear(): Promise<any> {
    return await this.bearerTokenModel.deleteMany({});
  }

  async getAll() {
    return await this.bearerTokenModel.find().exec();
  }

  async deleteMany(params): Promise<any> {
    return await this.bearerTokenModel.deleteMany(params);
  }

  async remove(token: BearerToken) {
    return await token.remove();
  }
}
