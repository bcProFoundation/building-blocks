import { IsNotEmpty } from 'class-validator';
import { IsMobileE164 } from '../../../common/decorators/is-mobile-e164.decorator';

export class SignupViaPhoneDto {
  @IsNotEmpty()
  name: string;

  @IsMobileE164()
  unverifiedPhone: string;
}
