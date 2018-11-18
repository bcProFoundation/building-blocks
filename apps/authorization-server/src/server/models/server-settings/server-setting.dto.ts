import { IsUrl, IsUUID, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ServerSettingDto {
  @ApiModelProperty({
    description: 'Substitute for datastore key.',
    type: 'string',
  })
  @IsUUID()
  uuid: string;

  @IsUrl()
  @ApiModelProperty({
    description: 'The URL of the server.',
    type: 'string',
    required: true,
  })
  issuerUrl: string;

  @IsOptional()
  @ApiModelProperty({
    description: 'OAuth 2.0 Client ID for Communication Server',
    type: 'string',
  })
  communicationServerClientId?: string;
}
