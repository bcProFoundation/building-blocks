import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerSettings } from './server-settings.entity';

@Injectable()
export class ServerSettingsService {
  constructor(
    @InjectRepository(ServerSettings)
    private readonly sessionRepository: Repository<ServerSettings>,
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
    return await this.sessionRepository.save(serverSettings);
  }

  async find() {
    const settings = await this.sessionRepository.find();
    return settings.length ? settings[0] : null;
  }

  async findOne(params) {
    return await this.sessionRepository.findOne(params);
  }

  async update(query, params) {
    return await this.sessionRepository.update(query, params);
  }
}
