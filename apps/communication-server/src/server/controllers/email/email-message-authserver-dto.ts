import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailMessageAuthServerDto {
  @IsEmail()
  emailTo: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  html: string;
}
