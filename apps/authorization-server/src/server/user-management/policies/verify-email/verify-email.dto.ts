import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @IsString()
  verificationCode: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
