import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentityProviderSettings } from './identity-provider-settings.entity';
import { settingsAlreadyExists } from 'exceptions';

@Injectable()
export class IdentityProviderSettingsService {
  constructor(
    @InjectRepository(IdentityProviderSettings)
    private readonly idpSettingsRepository: Repository<
      IdentityProviderSettings
    >,
  ) {}

  async save(params) {
    let serverSettings = new IdentityProviderSettings();
    if (params.uuid) {
      const exists: number = await this.count();
      serverSettings = await this.findOne({ uuid: params.uuid });
      serverSettings.appURL = params.appURL;
      if (exists > 0 && !serverSettings) {
        throw settingsAlreadyExists;
      }
      serverSettings.save();
    } else {
      serverSettings.appURL = params.appURL;
    }
    return await this.idpSettingsRepository.save(serverSettings);
  }

  async find() {
    const settings = await this.idpSettingsRepository.find();
    return settings.length ? settings[0] : null;
  }

  async findOne(params) {
    return await this.idpSettingsRepository.findOne(params);
  }

  async update(query, params) {
    return await this.idpSettingsRepository.update(query, params);
  }

  async count() {
    return this.idpSettingsRepository.count();
  }
}
