import { IsOptional, IsEnum } from 'class-validator';
import { QuerySort } from './sort.enum';

export class ListQueryDto {
  @IsOptional()
  offset: number;
  @IsOptional()
  limit: number;
  @IsOptional()
  search: string;
  @IsOptional()
  @IsEnum(QuerySort)
  sort: string;
}
