import { IsString, IsNotEmpty, IsUUID, IsUrl } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  clientId: string;

  @IsUrl({ allow_underscores: true })
  serviceURL: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
