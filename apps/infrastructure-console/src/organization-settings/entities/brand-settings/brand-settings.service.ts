import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandSettings } from './brand-settings.entity';

@Injectable()
export class BrandSettingsService {
  constructor(
    @InjectRepository(BrandSettings)
    private readonly repository: Repository<BrandSettings>,
  ) {}

  async find(): Promise<BrandSettings> {
    const settings = await this.repository.find();
    return settings.length ? settings[0] : null;
  }
}
