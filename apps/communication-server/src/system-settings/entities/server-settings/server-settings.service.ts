import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { settingsAlreadyExists } from '../../../exceptions';
import { ServerSettings } from './server-settings.entity';

@Injectable()
export class ServerSettingsService {
  constructor(
    @InjectRepository(ServerSettings)
    private readonly serverSettingsRepository: Repository<ServerSettings>,
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
    return await this.serverSettingsRepository.save(serverSettings);
  }

  async find(): Promise<ServerSettings> {
    const settings = await this.serverSettingsRepository.find();
    return settings.length ? settings[0] : null;
  }

  async findOne(params) {
    return await this.serverSettingsRepository.findOne(params);
  }

  async update(query, params) {
    return await this.serverSettingsRepository.update(query, params);
  }

  async count() {
    return this.serverSettingsRepository.count();
  }
}
