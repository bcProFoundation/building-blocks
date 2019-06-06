import {
  IsUrl,
  IsOptional,
  IsString,
  IsNumberString,
  ValidateNested,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { i18n } from '../../../i18n/i18n.config';
import { Type } from 'class-transformer';
import { RedirectURIsDTO } from './redirect-uris.dto';
import { AllowedScopeDTO } from './allowed-scopes.dto';
import { ClientAuthentication } from './client.interface';

export class CreateClientDto {
  @IsString()
  @ApiModelProperty({
    description: i18n.__('e.g MyAwesomeApp'),
    type: 'string',
    required: true,
  })
  name: string;

  @IsNumberString()
  @IsOptional()
  @ApiModelProperty({
    description: i18n.__(
      'Treat this as internal trusted client if trust is greater than 0',
    ),
    type: 'number',
  })
  isTrusted: number;

  @IsBoolean()
  @IsOptional()
  @ApiModelProperty({
    description: i18n.__('Skips the Allow/Deny screen if value is true'),
    type: 'boolean',
  })
  autoApprove: boolean;

  @ApiModelProperty({
    description: i18n.__(
      'Client app endpoint which will receive the token/code',
    ),
  })
  @ValidateNested({ each: true })
  @Type(() => RedirectURIsDTO)
  redirectUris: RedirectURIsDTO[];

  @ApiModelProperty({
    description: i18n.__('Allowed Scopes for Client app'),
  })
  @ValidateNested({ each: true })
  @Type(() => AllowedScopeDTO)
  allowedScopes: AllowedScopeDTO[];

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

  @IsEnum(ClientAuthentication)
  @IsOptional()
  @ApiModelProperty({
    description: i18n.__(
      'Type of method to authenticate client during authorization code exchange',
    ),
    required: false,
    type: 'string',
    enum: ClientAuthentication,
  })
  authenticationMethod: string;
}
