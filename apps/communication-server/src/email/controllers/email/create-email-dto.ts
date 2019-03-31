import { IsUrl, IsNumberString, IsString, IsEmail } from 'class-validator';

export class CreateEmailDto {
  uuid?: string;
  owner?: string;

  @IsString()
  name: string;

  @IsUrl({ require_protocol: false })
  host: string;

  @IsNumberString()
  port: number;

  @IsString()
  user: string;

  @IsString()
  pass: string;

  @IsEmail()
  from: string;
}
