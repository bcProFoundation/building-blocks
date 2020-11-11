import {
  Controller,
  UseGuards,
  Get,
  Query,
  Req,
  Param,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  SerializeOptions,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { CreateScopeDto } from '../../../user-management/policies';
import { RemoveOAuth2ScopeCommand } from '../../commands/remove-oauth2scope/remove-oauth2scope.command';
import { AddOAuth2ScopeCommand } from '../../commands/add-oauth2scope/add-oauth2scope.command';
import { ModifyOAuth2ScopeCommand } from '../../commands/modify-oauth2scope/modify-oauth2scope.command';
import { ListScopesQuery } from '../../queries/list-scopes/list-scopes.query';
import { GetScopesQuery } from '../../queries/get-scopes/get-scopes.query';
import { GetScopeByUuidQuery } from '../../queries/get-scope-by-uuid/get-scope-by-uuid.query';
import { ListQueryDto } from '../../../common/policies/list-query/list-query';
import { BearerTokenGuard } from '../../../auth/guards/bearer-token.guard';

@Controller('scope')
@SerializeOptions({ excludePrefixes: ['_'] })
export class ScopeController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('v1/list')
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async list(@Query() query: ListQueryDto) {
    const { offset, limit, search, sort } = query;
    return await this.queryBus.execute(
      new ListScopesQuery(offset, limit, search, sort),
    );
  }

  @Get('v1/find')
  async find() {
    return this.queryBus.execute(new GetScopesQuery());
  }

  @Post('v1/update/:uuid')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async update(
    @Param('uuid') uuid,
    @Body() payload: CreateScopeDto,
    @Req() req,
  ) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new ModifyOAuth2ScopeCommand(actorUserUuid, uuid, payload),
    );
  }

  @Post('v1/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async create(@Body() body: CreateScopeDto, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new AddOAuth2ScopeCommand(actorUserUuid, body),
    );
  }

  @Get('v1/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async findOne(@Param('uuid') uuid: string) {
    return await this.queryBus.execute(new GetScopeByUuidQuery(uuid));
  }

  @Post('v1/delete/:scopeName')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async deleteScope(@Param('scopeName') scopeName, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveOAuth2ScopeCommand(actorUserUuid, scopeName),
    );
  }
}
