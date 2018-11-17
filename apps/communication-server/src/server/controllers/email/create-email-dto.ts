import { IsUrl, IsNumberString, IsString } from 'class-validator';

export class CreateEmailDto {
  uuid?: string;

  @IsUrl({ require_protocol: false })
  host: string;

  @IsNumberString()
  port: number;

  @IsString()
  user: string;

  @IsString()
  pass: string;
}
