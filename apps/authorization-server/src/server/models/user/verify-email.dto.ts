import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  verificationCode: string;

  @IsString()
  password: string;
}
