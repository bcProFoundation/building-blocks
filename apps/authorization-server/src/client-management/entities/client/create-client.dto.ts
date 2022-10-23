import {
  IsUrl,
  IsOptional,
  IsString,
  IsNumberString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18n } from '../../../i18n/i18n.config';
import { ClientAuthentication } from './client.interface';

export class CreateClientDto {
  @IsString()
  @ApiProperty({
    description: i18n.__('e.g MyAwesomeApp'),
    type: 'string',
    required: true,
  })
  name: string;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({
    description: i18n.__(
      'Treat this as internal trusted client if trust is greater than 0',
    ),
    type: 'number',
  })
  isTrusted: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: i18n.__('Skips the Allow/Deny screen if value is true'),
    type: 'boolean',
  })
  autoApprove: boolean;

  @ApiProperty({
    description: i18n.__(
      'Client app endpoint which will receive the token/code',
    ),
  })
  @IsUrl({ allow_underscores: true, require_tld: false }, { each: true })
  redirectUris: string[];

  @ApiProperty({
    description: i18n.__('Allowed Scopes for Client app'),
  })
  @IsString({ each: true })
  allowedScopes: string[];

  @IsUrl({ require_tld: false })
  @IsOptional()
  @ApiProperty({
    description: i18n.__(
      'This endpoint on resource server will be informed when user is deleted',
    ),
    type: 'string',
  })
  userDeleteEndpoint: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({
    description: i18n.__(
      'This endpoint on resource server will be informed when token is deleted',
    ),
    type: 'string',
  })
  tokenDeleteEndpoint: string;

  @IsEnum(ClientAuthentication)
  @IsOptional()
  @ApiProperty({
    description: i18n.__(
      'Type of method to authenticate client during authorization code exchange',
    ),
    required: false,
    type: 'string',
    enum: ClientAuthentication,
  })
  authenticationMethod: string;
}
