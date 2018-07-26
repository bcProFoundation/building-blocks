import { IsString } from 'class-validator';
import { UserDto } from './user.dto';
import { ApiModelProperty } from '@nestjs/swagger';
import { USERDTO_NAME_DESCRIPTION } from 'constants/swagger';

export class CreateUserDto extends UserDto {
  @ApiModelProperty({
    description: USERDTO_NAME_DESCRIPTION,
    type: 'string',
    required: true,
  })
  @IsString()
  readonly name: string;
}
