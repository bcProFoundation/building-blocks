import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  USERDTO_NAME_DESCRIPTION,
  USERDTO_EMAIL_DESCRIPTION,
  USERDTO_EMAIL_EXAMPLE,
  USERDTO_PASSWORD_DESCRIPTION,
  USERDTO_PASSWORD_EXAMPLE,
} from '../../constants/swagger';
import { IsMobileE164 } from '../../auth/decorators/is-mobile-e164.decorator';
import { MOBILE_FORMAT_ERROR } from '../../constants/messages';

export class CreateUserDto {
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
    description: USERDTO_NAME_DESCRIPTION,
    type: 'string',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiModelProperty({
    description: USERDTO_NAME_DESCRIPTION,
    type: 'string',
    required: true,
  })
  @IsMobileE164({
    message: MOBILE_FORMAT_ERROR,
  })
  phone: string;
}
