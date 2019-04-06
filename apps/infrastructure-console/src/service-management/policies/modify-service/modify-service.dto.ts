import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class ModifyServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl({ allow_underscores: true })
  serviceURL: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}
