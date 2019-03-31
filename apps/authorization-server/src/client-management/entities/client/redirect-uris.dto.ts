import { IsUrl } from 'class-validator';

export class RedirectURIsDTO {
  @IsUrl({
    allow_underscores: true,
    require_valid_protocol: false,
  })
  uri: string;
}
