import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserClaimDto {
  @IsUUID('4')
  uuid: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  value: unknown | unknown[];

  @IsString()
  scope: string;
}
