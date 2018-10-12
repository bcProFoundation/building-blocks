import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUTHORIZATION_CODE } from './authorization-code.schema';
import { AuthorizationCode } from '../interfaces/authorization-code.interface';
import { invalidAuthorizationCodeException } from '../../auth/filters/exceptions';

@Injectable()
export class AuthorizationCodeService {
  constructor(
    @InjectModel(AUTHORIZATION_CODE)
    private readonly authCodeModel: Model<AuthorizationCode>,
  ) {}

  async save(params) {
    const checkCode = await this.findOne({ code: params.code });
    if (checkCode) throw invalidAuthorizationCodeException;
    const createdCode = new this.authCodeModel(params);
    return await createdCode.save();
  }

  async findOne(params) {
    return await this.authCodeModel.findOne(params);
  }

  async delete(params) {
    return await this.authCodeModel.deleteOne(params);
  }

  async clear() {
    return await this.authCodeModel.deleteMany({});
  }
}
