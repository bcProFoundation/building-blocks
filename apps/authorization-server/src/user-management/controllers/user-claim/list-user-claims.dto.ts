import { IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class ListUserClaimsDto {
  @IsNumberString()
  @IsOptional()
  offset: number;

  @IsNumberString()
  @IsOptional()
  limit: number;

  @IsUUID('4')
  uuid: string;
}
