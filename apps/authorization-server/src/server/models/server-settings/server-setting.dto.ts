import { IsUrl, IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ServerSettingDto {
  @IsUUID()
  @ApiModelProperty({
    description: 'Substitute for datastore key.',
    type: 'string',
  })
  uuid: string;

  @IsUrl()
  @ApiModelProperty({
    description: 'The URL of the server.',
    type: 'string',
    required: true,
  })
  appURL: string;
}
