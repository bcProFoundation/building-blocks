import { IsUrl, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ServerSettingsDto {
  uuid?: string;

  @IsUrl()
  @ApiModelProperty({
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
