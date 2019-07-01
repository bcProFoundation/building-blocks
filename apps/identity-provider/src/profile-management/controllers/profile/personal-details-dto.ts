import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class PersonalDetailsDTO {
  @IsUUID()
  uuid: string;

  @IsString()
  @IsOptional()
  givenName: string;

  @IsString()
  @IsOptional()
  middleName: string;

  @IsString()
  @IsOptional()
  familyName: string;

  @IsString()
  @IsOptional()
  nickname: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsDateString()
  @IsOptional()
  birthdate: Date;
}
