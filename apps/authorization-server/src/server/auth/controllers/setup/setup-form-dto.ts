import { IsEmail, IsUrl, IsNotEmpty, IsMobilePhone } from 'class-validator';
import { IsMobileE164 } from '../../decorators/is-mobile-e164.decorator';

export class SetupFormDTO {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsUrl()
  serverUrl: string;

  @IsNotEmpty()
  adminPassword: string;

  @IsMobileE164()
  phone: string;
}
