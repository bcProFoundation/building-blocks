import { IsUrl } from 'class-validator';

export class RedirectURIsDTO {
  @IsUrl({ allow_underscores: true }) uri: string;
}
