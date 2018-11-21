import { IsString, IsUUID } from 'class-validator';

export class PersonalSecondDetailsDTO {
  @IsUUID()
  uuid: string;
  //   @IsUrl()
  //   avatarUrl: string;
  @IsString()
  website: string;
  @IsString()
  zoneinfo: string;
  @IsString()
  locale: string;
}
