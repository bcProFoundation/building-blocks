import { IsString, IsUUID, IsOptional, IsUrl } from 'class-validator';

export class ProfileDetailsDTO {
  @IsUUID()
  uuid: string;

  @IsUrl()
  @IsOptional()
  website: string;

  @IsString()
  @IsOptional()
  zoneinfo: string;

  @IsString()
  @IsOptional()
  locale: string;
}
