import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveBrandInfoQuery } from './retrieve-brand-info.query';
import { BrandSettingsService } from '../../entities/brand-settings/brand-settings.service';
import { BrandSettings } from '../../entities/brand-settings/brand-settings.entity';

@QueryHandler(RetrieveBrandInfoQuery)
export class RetrieveBrandInfoHandler
  implements IQueryHandler<RetrieveBrandInfoQuery>
{
  constructor(private readonly brand: BrandSettingsService) {}
  async execute(query: RetrieveBrandInfoQuery) {
    const brandInfo = (await this.brand.find()) || ({} as BrandSettings);
    brandInfo._id = undefined;
    for (const key of Object.keys(brandInfo)) {
      if (brandInfo[key] === '') {
        brandInfo[key] = undefined;
      }
    }
    return brandInfo;
  }
}
