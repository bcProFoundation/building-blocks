import {
  Controller,
  UseGuards,
  Get,
  Query,
  Req,
  Param,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { callback } from '../../passport/http-bearer.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleService } from '../../../models/role/role.service';
import { UserService } from '../../../models/user/user.service';
import { invalidRoleException } from '../../../auth/filters/exceptions';

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

  @Post('v1/create')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async create(@Body() body, @Req() req, @Res() res) {
    await this.userService.checkAdministrator(req.user);
    const role = await this.roleService.save(body);
    res.json(role);
  }

  @Post('v1/update')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async update(@Body() payload, @Req() req, @Res() res) {
    await this.userService.checkAdministrator(req.user);
    const existingRole = await this.roleService.findOne({ uuid: payload.uuid });
    if (!existingRole) throw invalidRoleException;
    existingRole.name = payload.name;
    await existingRole.save();
    res.json({
      uuid: existingRole.uuid,
      name: existingRole.name,
    });
  }

  @Get('v1/find')
  async findAll() {
    return await this.roleService.find({});
  }

  @Get('v1/:uuid')
  @UseGuards(AuthGuard('bearer', { session: false, callback }))
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    await this.userService.checkAdministrator(req.user);
    return await this.roleService.findOne({ uuid });
  }
}
