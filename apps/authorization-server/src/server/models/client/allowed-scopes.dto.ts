import { IsString } from 'class-validator';

export class AllowedScopeDTO {
  @IsString() scope: string;
}
