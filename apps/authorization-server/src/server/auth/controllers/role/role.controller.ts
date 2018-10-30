import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { callback } from '../../passport/http-bearer.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleService } from '../../../models/role/role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('list')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    return await this.roleService.paginate(search, {
      offset: Number(offset),
      limit: Number(limit),
    });
  }
}
