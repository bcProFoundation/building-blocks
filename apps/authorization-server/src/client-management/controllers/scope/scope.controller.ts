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
  Res,
  SerializeOptions,
  Put,
  Delete,
} from '@nestjs/common';
import { ScopeService } from '../../../client-management/entities/scope/scope.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { CRUDOperationService } from '../../../common/services/crudoperation/crudoperation.service';
import { callback } from '../../../auth/passport/strategies/local.strategy';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { CreateScopeDto } from '../../../user-management/policies';
import { RemoveOAuth2ScopeCommand } from '../../../client-management/commands/remove-oauth2scope/remove-oauth2scope.command';
import { CommandBus } from '@nestjs/cqrs';

@Controller('scope')
@SerializeOptions({ excludePrefixes: ['_'] })
export class ScopeController {
  constructor(
    private readonly scopeService: ScopeService,
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
      this.scopeService.getModel(),
      offset,
      limit,
      search,
      query,
      ['name', 'description'],
      sortQuery,
    );
  }

  @Get('v1/find')
  async find() {
    return this.scopeService.find({});
  }

  @Put('v1/update/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async update(@Param('uuid') uuid, @Body() payload, @Req() req, @Res() res) {
    const scope = await this.scopeService.findOne({ uuid });
    scope.name = payload.name;
    scope.description = payload.description;
    await scope.save();
    res.json(scope);
  }

  @Post('v1/create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async create(@Body() body: CreateScopeDto, @Res() res) {
    const scope = await this.scopeService.save(body);

    scope._id = undefined;
    res.json(scope);
  }

  @Get('v1/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    return await this.scopeService.findOne({ uuid });
  }

  @Delete('v1/delete/:scopeName')
  @Roles(ADMINISTRATOR)
  @UseGuards(AuthGuard('bearer', { session: false, callback }), RoleGuard)
  async deleteScope(@Param('scopeName') scopeName, @Req() req) {
    const actorUserUuid = req.user.user;
    return await this.commandBus.execute(
      new RemoveOAuth2ScopeCommand(actorUserUuid, scopeName),
    );
  }
}
