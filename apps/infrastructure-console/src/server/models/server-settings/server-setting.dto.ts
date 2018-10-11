import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ServerSettingsDto {
  uuid?: string;

  @IsUrl()
  @ApiModelProperty({
    description: 'The URL of the application server.',
    type: 'string',
    required: true,
  })
  appURL: string;

  @IsUrl()
  @ApiModelProperty({
    description: 'The URL of central Authorization server.',
    type: 'string',
    required: true,
  })
  authServerURL: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description:
      'ID for this app, received after registering on the Authorization server.',
    type: 'string',
    required: true,
  })
  clientId: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description:
      'Secret key for this app, received after registering on the Authorization server.',
    type: 'string',
    required: true,
  })
  clientSecret: string;

  @IsUrl({ allow_underscores: true }, { each: true })
  callbackURLs: string[];
}
