import { Controller, UseGuards, Get, Query, Req } from '@nestjs/common';
import { callback } from '../../passport/http-bearer.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleService } from '../../../models/role/role.service';
import { UserService } from '../../../models/user/user.service';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
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
    await this.userService.checkAdministrator(req.user);
    return await this.roleService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }
}
