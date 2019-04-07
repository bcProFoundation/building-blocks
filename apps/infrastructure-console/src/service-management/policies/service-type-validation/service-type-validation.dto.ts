import { IsString, IsNotEmpty } from 'class-validator';

export class ServiceTypeValidationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
