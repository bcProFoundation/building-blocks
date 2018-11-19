import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupViaEmailDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
}
