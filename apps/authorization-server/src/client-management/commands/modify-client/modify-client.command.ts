import { ICommand } from '@nestjs/cqrs';
import { CreateClientDto } from '../../entities/client/create-client.dto';

export class ModifyClientCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly clientId: string,
    public readonly payload: CreateClientDto,
  ) {}
}
