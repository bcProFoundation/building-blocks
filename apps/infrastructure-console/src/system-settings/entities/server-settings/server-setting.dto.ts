import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServerSettingsDto {
  uuid?: string;

  @IsUrl()
  @ApiProperty({
    description: 'The URL of the application server.',
    type: 'string',
    required: true,
  })
  appURL: string;

  @IsUrl()
  @ApiProperty({
    description: 'The URL of central Authorization server.',
    type: 'string',
    required: true,
  })
  authServerURL: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'ID for this app, received after registering on the Authorization server.',
    type: 'string',
    required: true,
  })
  clientId: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'Secret key for this app, received after registering on the Authorization server.',
    type: 'string',
    required: true,
  })
  clientSecret: string;

  @IsUrl({ allow_underscores: true }, { each: true })
  callbackURLs: string[];
}
