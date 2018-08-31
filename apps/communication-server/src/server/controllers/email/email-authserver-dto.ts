import { IsUrl, IsNotEmpty } from 'class-validator';

export class EmailAuthServerDTO {
  @IsNotEmpty()
  clientId: string;
  @IsNotEmpty()
  clientSecret: string;
  @IsUrl()
  clientUrl: string;
  @IsUrl()
  authorizationServer: string;
}
