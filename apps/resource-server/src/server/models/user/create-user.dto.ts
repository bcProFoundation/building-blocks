import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  readonly name: string;

  @IsEmail() readonly email: string;

  @IsNotEmpty() public password: string;
}
