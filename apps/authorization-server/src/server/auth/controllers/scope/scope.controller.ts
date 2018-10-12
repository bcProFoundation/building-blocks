import { Controller, UseGuards, Get } from '@nestjs/common';
import { ScopeService } from '../../../models/scope/scope.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('scope')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService) {}

  @Get('list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list() {
    return await this.scopeService.find({});
  }
}
