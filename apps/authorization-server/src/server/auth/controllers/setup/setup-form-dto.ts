import { IsEmail, IsUrl, IsNotEmpty, IsMobilePhone } from 'class-validator';

export class SetupFormDTO {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsUrl()
  serverUrl: string;

  @IsNotEmpty()
  adminPassword: string;

  @IsMobilePhone('en-US')
  phone: string;
}
