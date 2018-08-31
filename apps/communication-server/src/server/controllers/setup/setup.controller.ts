import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SetupService } from './setup.service';
import { SetupFormDTO } from './setup-form-dto';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @Post('communication')
  @UsePipes(new ValidationPipe())
  async setupInfrastructure(@Body() setupForm: SetupFormDTO) {
    return await this.setupService.setupCommunicationClient(setupForm);
  }
}
