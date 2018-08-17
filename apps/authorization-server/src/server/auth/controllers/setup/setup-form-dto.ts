import { IsEmail, IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class SetupFormDTO {
  @IsNotEmpty()
  fullName: string;
  @IsEmail()
  email: string;
  @IsUrl()
  serverUrl: string;
  @IsNotEmpty()
  adminPassword: string;
}
