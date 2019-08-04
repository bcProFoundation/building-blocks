import {
  IsUrl,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { THIRTY_NUMBER, TEN_NUMBER } from '../../../constants/app-strings';

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

  @IsOptional()
  @IsNumber()
  otpExpiry?: number;

  @IsOptional()
  @IsBoolean()
  enableChoosingAccount?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(THIRTY_NUMBER)
  refreshTokenExpiresInDays?: number;

  @IsOptional()
  @IsNumber()
  @Min(TEN_NUMBER)
  authCodeExpiresInMinutes?: number;
}
