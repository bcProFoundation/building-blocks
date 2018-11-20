import { IsOptional, IsNumberString } from 'class-validator';

export class EmailListingDto {
  @IsOptional()
  @IsNumberString()
  take: number;

  @IsOptional()
  @IsNumberString()
  skip: number;

  @IsOptional()
  search: string;
}
