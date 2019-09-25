import { IsMobileE164 } from '../../../common/decorators/is-mobile-e164.decorator';

export class UnverifiedPhoneDto {
  @IsMobileE164()
  unverifiedPhone: string;
}
