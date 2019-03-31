import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerSettings } from './server-settings.entity';
import { settingsAlreadyExists } from '../../../exceptions';

@Injectable()
export class ServerSettingsService {
  constructor(
    @InjectRepository(ServerSettings)
    private readonly idpSettingsRepository: Repository<ServerSettings>,
  ) {}

  async save(params) {
    let serverSettings = new ServerSettings();
    if (params.uuid) {
      const exists: number = await this.count();
      serverSettings = await this.findOne({ uuid: params.uuid });
      serverSettings.appURL = params.appURL;
      if (exists > 0 && !serverSettings) {
        throw settingsAlreadyExists;
      }
      serverSettings.save();
    } else {
      Object.assign(serverSettings, params);
    }
    return await this.idpSettingsRepository.save(serverSettings);
  }

  async find(): Promise<ServerSettings> {
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
