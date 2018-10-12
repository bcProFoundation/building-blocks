import { IsUrl } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ServerSettingDto {
  @ApiModelProperty({
    description: 'Substitute for datastore key.',
    type: 'string',
  })
  uuid?: string;

  @IsUrl()
  @ApiModelProperty({
    description: 'The URL of the server.',
    type: 'string',
    required: true,
  })
  appURL: string;
}
