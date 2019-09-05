import {
  Controller,
  UseGuards,
  Get,
  Query,
  Req,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RemoveUserRoleCommand } from '../../commands/remove-user-role/remove-user-role.command';
import { ListRolesQuery } from '../../queries/list-roles/list-roles.query';
import { AddUserRoleCommand } from '../../commands/add-user-role/add-user-role.command';
import { ModifyUserRoleCommand } from '../../commands/modify-user-role/modify-user-role.command';
import { GetRolesQuery } from '../../queries/get-roles/get-roles.query';
import { RetrieveRolesQuery } from '../../queries/retrieve-role/retrieve-role.query';
import { ListQueryDto } from '../../../common/policies/list-query/list-query';

@Controller('role')
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('v1/list')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async list(@Query() query: ListQueryDto) {
    const { offset, limit, search, sort } = query;
    return await this.queryBus.execute(
      new ListRolesQuery(offset, limit, search, sort),
    );
  }

  @Post('v1/create')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body('name') roleName: string, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new AddUserRoleCommand(actorUserUuid, roleName),
    );
  }

  @Post('v1/update/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(@Param('uuid') uuid, @Body('name') name, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new ModifyUserRoleCommand(actorUserUuid, uuid, name),
    );
  }

  @Get('v1/find')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findAll() {
    return await this.queryBus.execute(new GetRolesQuery());
  }

  @Get('v1/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findOne(@Param('uuid') uuid: string) {
    return await this.queryBus.execute(new RetrieveRolesQuery(uuid));
  }

  @Post('v1/delete/:roleName')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async deleteRole(@Param('roleName') roleName: string, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveUserRoleCommand(actorUserUuid, roleName),
    );
  }
}
