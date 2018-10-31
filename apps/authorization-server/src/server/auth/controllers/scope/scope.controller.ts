import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { ScopeService } from '../../../models/scope/scope.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('scope')
export class ScopeController {
  constructor(private readonly scopeService: ScopeService) {}

  @Get('list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return await this.scopeService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get('find')
  async find() {
    return this.scopeService.find({});
  }
}
