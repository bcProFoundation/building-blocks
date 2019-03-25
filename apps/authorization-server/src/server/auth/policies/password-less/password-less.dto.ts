import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PasswordLessDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  redirect: string;
}
