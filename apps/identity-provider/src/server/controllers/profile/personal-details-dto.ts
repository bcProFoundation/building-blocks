import { IsString, IsUUID, IsDateString } from 'class-validator';

export class PersonalDetailsDTO {
  @IsUUID()
  uuid: string;
  @IsString()
  givenName: string;
  @IsString()
  middleName: string;
  @IsString()
  familyName: string;
  @IsString()
  nickname: string;
  @IsString()
  gender: string;
  @IsDateString()
  birthdate: Date;
}
