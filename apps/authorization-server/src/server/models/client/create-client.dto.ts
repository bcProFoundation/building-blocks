import { IsUrl, IsInt, IsAlphanumeric, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { i18n } from '../../i18n/i18n.config';

export class CreateClientDto {
  @IsAlphanumeric()
  @ApiModelProperty({
    description: i18n.__('e.g MyAwesomeApp'),
    type: 'string',
    required: true,
  })
  name: string;

  @IsAlphanumeric()
  @ApiModelProperty({
    description: i18n.__('Auto generated OAuth2.0 Client secret key'),
    type: 'string',
    required: true,
  })
  clientSecret: string;

  @IsInt()
  @IsOptional()
  @ApiModelProperty({
    description: i18n.__('Skips the Allow/Deny screen if value is 1'),
    type: 'number',
  })
  isTrusted: number;

  @IsUrl()
  @ApiModelProperty({
    description: i18n.__(
      'Client app endpoint which will receive the token/code',
    ),
    type: 'string',
    required: true,
  })
  redirectUris: string[];

  @IsUrl()
  @IsOptional()
  @ApiModelProperty({
    description: i18n.__(
      'This endpoint on resource server will be informed when user is deleted',
    ),
    type: 'string',
  })
  userDeleteEndpoint: string;

  @IsUrl()
  @IsOptional()
  @ApiModelProperty({
    description: i18n.__(
      'This endpoint on resource server will be informed when token is deleted',
    ),
    type: 'string',
  })
  tokenDeleteEndpoint: string;
}
