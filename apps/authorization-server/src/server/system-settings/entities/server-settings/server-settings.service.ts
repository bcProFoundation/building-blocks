import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Model } from 'mongoose';
import { settingsNotFoundException } from '../../../common/filters/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { SERVER_SETTINGS } from './server-settings.schema';
import { ServerSettings } from './server-settings.interface';
import { i18n } from '../../../i18n/i18n.config';

@Injectable()
export class ServerSettingsService {
  constructor(
    @InjectModel(SERVER_SETTINGS)
    private readonly settingsModel: Model<ServerSettings>,
  ) {}

  async save(params) {
    const checkSettings = await this.count();
    if (checkSettings > 0) {
      throw new HttpException(
        i18n.__('Setup already complete'),
        HttpStatus.UNAUTHORIZED,
      );
    }
    const createdSettings = new this.settingsModel(params);
    return await createdSettings.save();
  }

  async find() {
    const settings = await this.settingsModel.find().exec();
    if (!settings.length) {
      throw settingsNotFoundException;
    }
    return settings[0];
  }

  async findOne(params) {
    return await this.settingsModel.findOne(params);
  }

  async update(query, params) {
    return await this.settingsModel.update(query, params);
  }

  async count() {
    return await this.settingsModel.estimatedDocumentCount();
  }
}
