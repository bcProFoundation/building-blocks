import { UserDto } from './user.dto';
import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { USERDTO_REDIRECT_DESCRIPTION } from 'constants/swagger';

export class LoginUserDto extends UserDto {
  @ApiModelProperty({
    description: USERDTO_REDIRECT_DESCRIPTION,
    type: 'string',
    required: true,
  })
  @IsString()
  readonly redirect: string;
}
