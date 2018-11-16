import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateScopeDto {
  @IsNotEmpty()
  @ApiModelProperty({
    description: '',
    type: 'string',
    required: true,
  })
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: '',
    type: 'string',
    required: true,
  })
  @IsString()
  readonly description: string;
}
