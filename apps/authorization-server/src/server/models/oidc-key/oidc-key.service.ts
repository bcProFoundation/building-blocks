import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OIDCKey } from './oidc-key.entity';
import * as jose from 'node-jose';

@Injectable()
export class OIDCKeyService {
  constructor(
    @InjectRepository(OIDCKey)
    private readonly oidcKeyRepository: Repository<OIDCKey>,
  ) {}

  async save(oidcKey) {
    return await this.oidcKeyRepository.save(oidcKey);
  }

  async findOne(params) {
    return await this.oidcKeyRepository.findOne(params);
  }

  async find() {
    return await this.oidcKeyRepository.find();
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
    return await this.oidcKeyRepository.count();
  }
}
