import {
  IsEmail,
  IsUrl,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';
import { IsMobileE164 } from '../../../common/decorators/is-mobile-e164.decorator';
import { i18n } from '../../../i18n/i18n.config';

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

  @IsMobileE164({ message: i18n.__('phone must be valid E164 phone number') })
  phone: string;

  @IsString()
  @IsOptional()
  organizationName: string;
}
