import { IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateSocialLoginDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  clientSecret: string;

  @IsUrl()
  authorizationURL: string;

  @IsUrl()
  tokenURL: string;

  @IsUrl()
  @IsOptional()
  introspectionURL: string;

  @IsUrl()
  @IsOptional()
  baseURL: string;

  @IsUrl()
  profileURL: string;

  @IsUrl()
  @IsOptional()
  revocationURL: string;

  @IsNotEmpty({ each: true })
  scope: string[];
}
