import { ICommand } from '@nestjs/cqrs';

export class RemoveUserClaimCommand implements ICommand {
  constructor(public readonly uuid: string, public readonly name: string) {}
}
