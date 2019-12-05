import { IsUrl, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServerSettingsUpdateDto {
  @IsOptional()
  @IsUrl()
  @ApiProperty({
    description: 'The URL of the server.',
    type: 'string',
    required: true,
  })
  appURL: string;

  @IsOptional()
  @IsUrl()
  authServerURL: string;

  @IsOptional()
  @IsNotEmpty()
  clientId: string;

  @IsOptional()
  @IsNotEmpty()
  clientSecret: string;

  @IsOptional()
  @IsUrl({ allow_underscores: true }, { each: true })
  callbackURLs: string[];

  @IsOptional()
  communicationServerSystemEmailAccount: string;
}
