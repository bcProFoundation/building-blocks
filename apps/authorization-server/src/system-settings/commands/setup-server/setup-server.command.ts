import { ICommand } from '@nestjs/cqrs';
import { SetupFormDTO } from '../../controllers/setup/setup-form-dto';

export class SetupServerCommand implements ICommand {
  constructor(public readonly payload: SetupFormDTO) {}
}
