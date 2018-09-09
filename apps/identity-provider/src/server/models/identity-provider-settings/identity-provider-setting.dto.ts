import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class IdentityProviderSettingsDto {
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

  @IsUrl()
  profileURL: string;

  @IsUrl()
  tokenURL: string;

  @IsUrl()
  introspectionURL: string;

  @IsUrl()
  authorizationURL: string;

  @IsUrl({ allow_underscores: true }, { each: true })
  callbackURLs: string[];
}
