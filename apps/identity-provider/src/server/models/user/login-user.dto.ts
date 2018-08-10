import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { USERDTO_REDIRECT_DESCRIPTION } from '../../constants/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  USERDTO_EMAIL_DESCRIPTION,
  USERDTO_PASSWORD_DESCRIPTION,
  USERDTO_EMAIL_EXAMPLE,
  USERDTO_PASSWORD_EXAMPLE,
} from '../../constants/swagger';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty({
    description: USERDTO_EMAIL_DESCRIPTION,
    required: true,
    example: USERDTO_EMAIL_EXAMPLE,
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: USERDTO_PASSWORD_DESCRIPTION,
    required: true,
    example: USERDTO_PASSWORD_EXAMPLE,
  })
  public password: string;

  @ApiModelProperty({
    description: USERDTO_REDIRECT_DESCRIPTION,
    type: 'string',
    required: true,
  })
  @IsString()
  readonly redirect: string;
}
