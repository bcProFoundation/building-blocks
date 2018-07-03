import { IsUrl, IsInt, IsAlphanumeric } from 'class-validator';

export class CreateClientDto {
  @IsAlphanumeric() name: string;

  @IsAlphanumeric() clientSecret: string;

  @IsInt() isTrusted: number;

  @IsUrl() redirectUri: string;
}
