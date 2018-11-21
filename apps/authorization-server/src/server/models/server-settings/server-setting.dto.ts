import { IsUrl, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ServerSettingDto {
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
