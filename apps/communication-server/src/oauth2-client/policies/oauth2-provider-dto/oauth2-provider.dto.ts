import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';

export class OAuth2ProviderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  authServerURL: string;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsNotEmpty()
  clientSecret: string;

  @IsUrl()
  @IsOptional()
  profileURL: string;

  @IsUrl()
  tokenURL: string;

  @IsUrl()
  authorizationURL: string;

  @IsUrl()
  revocationURL: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  scope: string[];
}
