import { IsUrl, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServerSettingsDto {
  uuid?: string;

  @IsUrl()
  @ApiProperty({
    description: 'The URL of the server.',
    type: 'string',
    required: true,
  })
  appURL: string;

  @IsUrl()
  authServerURL: string;

  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  clientSecret: string;

  @IsUrl({ allow_underscores: true }, { each: true })
  callbackURLs: string[];

  @IsUUID()
  @IsOptional()
  cloudStorageSettings: string;
}
