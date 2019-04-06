import { ICommand } from '@nestjs/cqrs';
import { ServiceTypeValidationDto } from '../../policies/service-type-validation/service-type-validation.dto';

export class AddServiceTypeCommand implements ICommand {
  constructor(public payload: ServiceTypeValidationDto) {}
}
