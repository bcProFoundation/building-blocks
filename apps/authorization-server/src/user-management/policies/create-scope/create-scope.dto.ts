import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScopeDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Scope Name',
    type: 'string',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'Scope Description',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description: string;
}
