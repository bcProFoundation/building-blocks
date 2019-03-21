import { IsUrl, IsOptional, IsUUID, IsBoolean } from 'class-validator';
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
  @IsUUID()
  @ApiModelProperty({
    description: 'OAuth 2.0 Client ID for Communication Server',
    type: 'string',
  })
  communicationServerClientId?: string;

  @IsOptional()
  @IsUUID()
  @ApiModelProperty({
    description: 'OAuth 2.0 Client ID for Identity Provider',
    type: 'string',
  })
  identityProviderClientId?: string;

  @IsOptional()
  @IsUUID()
  @ApiModelProperty({
    description: 'OAuth 2.0 Client ID for Infrastructure Console',
    type: 'string',
  })
  infrastructureConsoleClientId?: string;

  @IsOptional()
  @IsUUID()
  @ApiModelProperty({
    description: 'Cloud Storage Bucket',
    type: 'string',
  })
  backupBucket?: string;

  @IsOptional()
  @IsBoolean()
  disableSignup?: boolean;
}
