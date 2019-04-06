import { ICommand } from '@nestjs/cqrs';
import { ModifyServiceDto } from '../../policies/modify-service/modify-service.dto';

export class ModifyServiceCommand implements ICommand {
  constructor(
    public readonly clientId: string,
    public readonly payload: ModifyServiceDto,
  ) {}
}
