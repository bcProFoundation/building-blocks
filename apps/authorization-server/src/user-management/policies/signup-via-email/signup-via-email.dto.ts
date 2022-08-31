import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class SignupViaEmailDto {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsUrl()
  @IsOptional()
  redirect: string;
}
