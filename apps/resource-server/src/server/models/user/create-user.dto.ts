import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString() readonly name: string;

  @IsEmail() readonly email: string;

  @IsNotEmpty() public password: string;
}
