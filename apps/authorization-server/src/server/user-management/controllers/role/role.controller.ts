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
  Put,
} from '@nestjs/common';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleService } from '../../../user-management/entities/role/role.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { invalidRoleException } from '../../../common/filters/exceptions';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly crudService: CRUDOperationService,
  ) {}

  @Get('v1/list')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(
    @Req() req,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    const sortQuery = { name: sort };
    const query: any = {};
    return this.crudService.listPaginate(
      this.roleService.getModel(),
      offset,
      limit,
      search,
      query,
      ['name'],
      sortQuery,
    );
  }

  @Post('v1/create')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body() body, @Req() req, @Res() res) {
    const role = await this.roleService.save(body);
    res.json(role);
  }

  @Put('v1/update/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(@Param('uuid') uuid, @Body() payload, @Req() req, @Res() res) {
    const existingRole = await this.roleService.findOne({ uuid });
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
