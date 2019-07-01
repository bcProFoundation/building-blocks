import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateScopeDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: 'Scope Name',
    type: 'string',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiModelProperty({
    description: 'Scope Description',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly description: string;
}
