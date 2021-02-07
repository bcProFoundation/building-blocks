import { IsEmail } from 'class-validator';

export class UnverifiedEmailDto {
  @IsEmail()
  unverifiedEmail: string;
}
