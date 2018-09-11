import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerSettings } from './server-settings.entity';
import { settingsNotFoundException } from '../../auth/filters/exceptions';

@Injectable()
export class ServerSettingsService {
  constructor(
    @InjectRepository(ServerSettings)
    private readonly settingsRepository: Repository<ServerSettings>,
  ) {}

  async save(params) {
    let serverSettings = new ServerSettings();
    if (params.uuid) {
      serverSettings = await this.findOne({ uuid: params.uuid });
      serverSettings.appURL = params.appURL;
      serverSettings.save();
    } else {
      serverSettings.appURL = params.appURL;
    }
    return await this.settingsRepository.save(serverSettings);
  }

  async find() {
    const settings = await this.settingsRepository.find();
    if (!settings.length) {
      throw settingsNotFoundException;
    }
    return settings[0];
  }

  async findOne(params) {
    return await this.settingsRepository.findOne(params);
  }

  async update(query, params) {
    return await this.settingsRepository.update(query, params);
  }
}
