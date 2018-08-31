import { IsUrl, IsNotEmpty } from 'class-validator';

export class SetupFormDTO {
  @IsNotEmpty()
  clientId: string;
  @IsNotEmpty()
  clientSecret: string;
  @IsUrl()
  clientUrl: string;
  @IsUrl()
  authorizationServer: string;
}
