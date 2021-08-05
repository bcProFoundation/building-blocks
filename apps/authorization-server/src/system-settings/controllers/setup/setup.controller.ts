import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SetupServerCommand } from '../../commands/setup-server/setup-server.command';
import { SetupFormDTO } from './setup-form-dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async setupInfrastructure(@Body() setupForm: SetupFormDTO) {
    return await this.commandBus.execute(new SetupServerCommand(setupForm));
  }
}
