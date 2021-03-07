import {
  IsUrl,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsNumber,
  Min,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { THIRTY_NUMBER, TEN_NUMBER } from '../../../constants/app-strings';

export class ServerSettingDto {
  @IsUrl()
  @ApiProperty({
    description: 'The URL of the server.',
    type: 'string',
    required: true,
  })
  issuerUrl: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'OAuth 2.0 Client ID for Communication Server',
    type: 'string',
  })
  communicationServerClientId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'OAuth 2.0 Client ID for Identity Provider',
    type: 'string',
  })
  identityProviderClientId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'OAuth 2.0 Client ID for Infrastructure Console',
    type: 'string',
  })
  infrastructureConsoleClientId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The name of host organization.',
    type: 'string',
  })
  organizationName: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Allow users to register phone',
    type: 'boolean',
  })
  enableUserPhone: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Disallow user to be deleted',
    type: 'boolean',
  })
  isUserDeleteDisabled: boolean;
}
