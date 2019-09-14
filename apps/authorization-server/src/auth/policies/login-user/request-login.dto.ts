import { IsString } from 'class-validator';

export class RequestLogin {
  @IsString()
  username: string;
}
