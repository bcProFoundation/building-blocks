import {
  IsUrl,
  IsOptional,
  IsString,
  IsNumberString,
  ValidateNested,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { i18n } from '../../../i18n/i18n.config';
import { Type } from 'class-transformer';
import { RedirectURIsDTO } from './redirect-uris.dto';
import { AllowedScopeDTO } from './allowed-scopes.dto';

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
    description: i18n.__('Skips the Allow/Deny screen if value is 1'),
    type: 'number',
  })
  isTrusted: number;

  @ApiModelProperty({
    description: i18n.__(
      'Client app endpoint which will receive the token/code',
    ),
  })
  @ValidateNested()
  @Type(() => RedirectURIsDTO)
  redirectUris: RedirectURIsDTO[];

  @ApiModelProperty({
    description: i18n.__('Allowed Scopes for Client app'),
  })
  @ValidateNested()
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
}
