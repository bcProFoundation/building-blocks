import { IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateSocialLoginDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsOptional()
  clientId: string;

  @IsOptional()
  clientSecret: string;

  @IsUrl()
  @IsOptional()
  authorizationURL: string;

  @IsUrl()
  @IsOptional()
  tokenURL: string;

  @IsUrl()
  @IsOptional()
  introspectionURL: string;

  @IsUrl()
  @IsOptional()
  baseURL: string;

  @IsUrl()
  @IsOptional()
  profileURL: string;

  @IsUrl()
  @IsOptional()
  revocationURL: string;

  @IsNotEmpty({ each: true })
  scope: string[];
}
