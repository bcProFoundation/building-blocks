import { IsUrl, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { i18n } from '../../i18n/i18n.config';

export class CreateClientDto {
  @IsString()
  @ApiModelProperty({
    description: i18n.__('e.g MyAwesomeApp'),
    type: 'string',
    required: true,
  })
  name: string;

  @IsNumber()
  @IsOptional()
  @ApiModelProperty({
    description: i18n.__('Skips the Allow/Deny screen if value is 1'),
    type: 'number',
  })
  isTrusted: number;

  @IsUrl({}, { each: true })
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
