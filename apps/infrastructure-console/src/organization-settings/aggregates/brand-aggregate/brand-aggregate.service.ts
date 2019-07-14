import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { UpdateBrandInfoDto } from '../../policies/update-brand-info/update-brand-info.dto';
import { BrandInfoUpdatedEvent } from '../../events/brand-info-updated/brand-info-updated.event';
import { BrandSettingsService } from '../../entities/brand-settings/brand-settings.service';
import { BrandSettings } from '../../entities/brand-settings/brand-settings.entity';

@Injectable()
export class BrandAggregateService extends AggregateRoot {
  constructor(private readonly brandInfo: BrandSettingsService) {
    super();
  }

  async updateBrandInfo(
    req: { [key: string]: any },
    payload: UpdateBrandInfoDto,
  ) {
    const brandSettings = (await this.brandInfo.find()) || new BrandSettings();
    Object.assign(brandSettings, payload);
    this.apply(new BrandInfoUpdatedEvent(brandSettings));
  }
}
