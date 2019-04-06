import { ICommand } from '@nestjs/cqrs';
import { CreateServiceDto } from '../../policies/create-service/create-service.dto';
import { TokenCache } from 'auth/entities/token-cache/token-cache.entity';

export class RegisterServiceCommand implements ICommand {
  constructor(
    public readonly payload: CreateServiceDto,
    public readonly token: TokenCache,
  ) {}
}
