import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { i18n } from '../../i18n/i18n.config';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiModelProperty({
    description: i18n.__('Identifies a user uniquely'),
    required: true,
    example: i18n.__('luke.skywalker@twosuns.com'),
  })
  readonly username: string;

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
    description: i18n.__(
      'URL to which the user will be redirected after login',
    ),
    type: 'string',
    required: true,
  })
  @IsString()
  readonly redirect: string;
}
