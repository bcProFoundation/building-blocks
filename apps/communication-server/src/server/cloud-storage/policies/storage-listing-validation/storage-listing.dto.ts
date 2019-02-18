import { IsOptional, IsNumberString } from 'class-validator';

export class StorageListingDto {
  @IsOptional()
  @IsNumberString()
  take: number;

  @IsOptional()
  @IsNumberString()
  skip: number;

  @IsOptional()
  search: string;
}
