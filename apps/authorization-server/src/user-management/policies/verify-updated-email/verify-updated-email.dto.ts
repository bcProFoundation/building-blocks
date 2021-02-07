import { IsString } from 'class-validator';

export class VerifyUpdatedEmailDto {
  @IsString()
  verificationCode: string;
}
