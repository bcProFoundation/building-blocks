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
  Delete,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleService } from '../../../user-management/entities/role/role.service';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { invalidRoleException } from '../../../common/filters/exceptions';
import { RemoveUserRoleCommand } from '../../../user-management/commands/remove-user-role/remove-user-role.command';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly crudService: CRUDOperationService,
    private readonly commandBus: CommandBus,
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

  @Delete('v1/delete/:roleName')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async deleteRole(@Param('roleName') roleName: string, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveUserRoleCommand(actorUserUuid, roleName),
    );
  }
}
