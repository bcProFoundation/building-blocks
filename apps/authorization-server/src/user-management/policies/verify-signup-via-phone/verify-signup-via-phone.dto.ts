import { IsNotEmpty } from 'class-validator';
import { IsMobileE164 } from '../../../common/decorators/is-mobile-e164.decorator';

export class VerifySignupViaPhoneDto {
  @IsNotEmpty()
  otp: string;

  @IsMobileE164()
  unverifiedPhone: string;
}
