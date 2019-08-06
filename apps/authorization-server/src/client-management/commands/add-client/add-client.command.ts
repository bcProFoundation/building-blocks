import { ICommand } from '@nestjs/cqrs';
import { CreateClientDto } from '../../entities/client/create-client.dto';

export class AddClientCommand implements ICommand {
  constructor(
    public readonly actorUuid: string,
    public readonly payload: CreateClientDto,
  ) {}
}
