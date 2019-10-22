import { IsString, IsNumberString } from 'class-validator';

export class RetrieveFileDto {
  @IsString()
  filename: string;
  @IsNumberString()
  expiry: string;
}
