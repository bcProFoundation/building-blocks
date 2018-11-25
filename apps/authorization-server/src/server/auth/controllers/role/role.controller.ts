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
import { callback } from '../../passport/local.strategy';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleService } from '../../../models/role/role.service';
import { invalidRoleException } from '../../../auth/filters/exceptions';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { RoleGuard } from '../../../auth/guards/role.guard';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('v1/list')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
  ) {
    const query: { search?: RegExp } = {};

    if (search) query.search = new RegExp(search, 'i');

    const roleModel = this.roleService.getRoleModel();
    const data = await roleModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .exec();

    return {
      docs: data,
      length: await roleModel.estimatedDocumentCount(),
      offset,
    };
  }

  @Post('v1/create')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body() body, @Req() req, @Res() res) {
    const role = await this.roleService.save(body);
    res.json(role);
  }

  @Post('v1/update')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(@Body() payload, @Req() req, @Res() res) {
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
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findAll() {
    return await this.roleService.find({});
  }

  @Get('v1/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    return await this.roleService.findOne({ uuid });
  }
}
