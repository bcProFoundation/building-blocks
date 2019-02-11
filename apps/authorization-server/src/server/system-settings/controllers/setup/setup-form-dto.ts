import { IsEmail, IsUrl, IsNotEmpty } from 'class-validator';
import { IsMobileE164 } from '../../../common/decorators/is-mobile-e164.decorator';

export class SetupFormDTO {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsUrl()
  infrastructureConsoleUrl: string;

  @IsUrl()
  issuerUrl: string;

  @IsNotEmpty()
  adminPassword: string;

  @IsMobileE164()
  phone: string;
}