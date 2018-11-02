import { Controller, UseGuards, Get, Query, Req } from '@nestjs/common';
import { ScopeService } from '../../../models/scope/scope.service';
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { UserService } from '../../../models/user/user.service';

@Controller('scope')
export class ScopeController {
  constructor(
    private readonly scopeService: ScopeService,
    private readonly userService: UserService,
  ) {}

  @Get('v1/list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    await this.userService.checkAdministrator(req.user.user);
    return await this.scopeService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }

  @Get('v1/find')
  async find() {
    return this.scopeService.find({});
  }
}
