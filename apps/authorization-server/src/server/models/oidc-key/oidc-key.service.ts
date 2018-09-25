import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as jose from 'node-jose';
import { InjectModel } from '@nestjs/mongoose';
import { OIDC_KEY } from './oidc-key.schema';
import { OIDCKey } from '../interfaces/oidc-key.interface';

@Injectable()
export class OIDCKeyService {
  constructor(
    @InjectModel(OIDC_KEY) private readonly oidcKeyModel: Model<OIDCKey>,
  ) {}

  async save(oidcKey) {
    const createdKey = new this.oidcKeyModel(oidcKey);
    return await createdKey.save();
  }

  async findOne(params) {
    return await this.oidcKeyModel.findOne(params);
  }

  async find() {
    return await this.oidcKeyModel.find().exec();
  }

  async generateKey() {
    const keystore = jose.JWK.createKeyStore();
    const newKey = await keystore.generate('RSA', 2048);
    const key = keystore.get(newKey.kid);
    await this.save({
      keyPair: key.toJSON(true),
    });
  }

  async count() {
    return await this.oidcKeyModel.estimatedDocumentCount();
  }
}
