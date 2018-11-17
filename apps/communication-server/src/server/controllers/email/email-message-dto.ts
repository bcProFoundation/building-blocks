import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailMessageDto {
  @IsEmail()
  emailTo: string;

  @IsEmail()
  emailFrom: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  html: string;
}
