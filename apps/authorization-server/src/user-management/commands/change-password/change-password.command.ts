import { ICommand } from '@nestjs/cqrs';
import { ChangePasswordDto } from '../../../user-management/policies';

export class ChangePasswordCommand implements ICommand {
  constructor(
    public readonly userUuid: string,
    public readonly passwordPayload: ChangePasswordDto,
  ) {}
}
