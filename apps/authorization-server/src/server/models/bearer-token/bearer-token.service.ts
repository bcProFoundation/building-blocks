import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BEARER_TOKEN } from './bearer-token.schema';
import { BearerToken } from '../interfaces/bearer-token.interface';
import { i18n } from '../../i18n/i18n.config';

@Injectable()
export class BearerTokenService {
  constructor(
    @InjectModel(BEARER_TOKEN)
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

  async clear() {
    return await this.bearerTokenModel.deleteMany({});
  }

  async getAll() {
    return await this.bearerTokenModel.find().exec();
  }

  getModel() {
    return this.bearerTokenModel;
  }
}
