import { IsUUID, IsOptional } from 'class-validator';

export class RegisterDeviceDto {
  @IsUUID()
  @IsOptional()
  userUuid: string;
}
