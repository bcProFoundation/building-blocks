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

  @Post()
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async setupInfrastructure(@Body() setupForm: SetupFormDTO) {
    return await this.setupService.setupInfrastructureClient(
      setupForm.fullName,
      setupForm.email,
      setupForm.phone,
      setupForm.infrastructureConsoleUrl,
      setupForm.adminPassword,
      setupForm.issuerUrl,
      setupForm.organizationName,
    );
  }
}
