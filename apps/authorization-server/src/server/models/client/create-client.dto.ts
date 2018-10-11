import { IsUrl, IsInt, IsAlphanumeric } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import {
  CLIENT_NAME_DESCRIPTION,
  CLIENT_SECRET_DESCRIPTION,
  CLIENT_IS_TRUSTED,
  CLIENT_REDIRECT_URI,
} from '../../constants/swagger';

export class CreateClientDto {
  @IsAlphanumeric()
  @ApiModelProperty({
    description: CLIENT_NAME_DESCRIPTION,
    type: 'string',
    required: true,
  })
  name: string;

  @IsAlphanumeric()
  @ApiModelProperty({
    description: CLIENT_SECRET_DESCRIPTION,
    type: 'string',
    required: true,
  })
  clientSecret: string;

  @IsInt()
  @ApiModelProperty({ description: CLIENT_IS_TRUSTED, type: 'number' })
  isTrusted: number;

  @IsUrl()
  @ApiModelProperty({
    description: CLIENT_REDIRECT_URI,
    type: 'string',
    required: true,
  })
  redirectUris: string[];
}
