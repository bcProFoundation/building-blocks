import { IsString, IsUrl } from 'class-validator';

export class CreateClientDto {
  @IsString() clientId: string;

  @IsString() clientSecret: string;

  @IsUrl() redirectUri: string;

  @IsUrl() authorizationUrl: string;

  @IsUrl() tokenUrl: string;
}
