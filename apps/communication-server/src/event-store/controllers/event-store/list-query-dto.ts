import { IsNumberString, IsEnum, IsOptional, IsString } from 'class-validator';

export const FORWARD = 'forward';
export const BACKWARD = 'backward';

export class EventListQueryDto {
  @IsNumberString()
  @IsOptional()
  length: number;

  @IsEnum({ forward: FORWARD, backward: BACKWARD })
  @IsOptional()
  direction: string;

  @IsNumberString()
  @IsOptional()
  page: number;

  @IsString({ each: true })
  @IsOptional()
  type: string[];

  @IsString()
  @IsOptional()
  stream: string;
}
