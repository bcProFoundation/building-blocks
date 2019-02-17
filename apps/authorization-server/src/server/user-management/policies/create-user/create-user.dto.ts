import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsMobileE164 } from '../../../common/decorators/is-mobile-e164.decorator';
import { i18n } from '../../../i18n/i18n.config';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty({
    description: i18n.__('Identifies a user uniquely'),
    required: true,
    example: i18n.__('luke.skywalker@twosuns.com'),
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiModelProperty({
    description: i18n.__(
      'Strong alphanumeric password, enriched with special characters',
    ),
    required: true,
    example: 'h4cv_4%b2#D:-)',
  })
  public password: string;

  @ApiModelProperty({
    description: i18n.__('Full name of the user'),
    type: 'string',
    required: true,
  })
  @IsString()
  readonly name: string;

  @ApiModelProperty({
    description: i18n.__('Mobile number in E.164 format'),
    type: 'string',
    required: true,
  })
  @IsMobileE164({
    message: i18n.__('Mobile format must be E.164'),
  })
  phone: string;
}
