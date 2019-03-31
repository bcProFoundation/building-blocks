import { IsString, IsOptional, IsUrl } from 'class-validator';

export class ModifyStorageDto {
  @IsString()
  @IsOptional()
  version: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  region: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  endpoint: string;

  @IsString()
  @IsOptional()
  accessKey: string;

  @IsString()
  @IsOptional()
  secretKey: string;

  @IsString()
  @IsOptional()
  bucket: string;
}
