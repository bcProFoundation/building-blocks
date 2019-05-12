import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { OAuth2ProviderDto } from '../../policies/oauth2-provider-dto/oauth2-provider.dto';
import { AddOAuth2ProviderCommand } from '../../commands/add-oauth2-provider/add-oauth2-provider.command';
import { RemoveOAuth2ProviderCommand } from '../../commands/remove-oauth2-provider/remove-oauth2-provider.command';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { UpdateOAuth2ProviderCommand } from '../../commands/update-oauth2-provider/update-oauth2-provider.command';
import { ListOAuth2ProviderQuery } from '../../queries/list-oauth2-providers/list-oauth2-providers.query';
import { RetrieveOAuth2ProviderQuery } from '../../queries/retrieve-oauth2-provider/retrieve-oauth2-provider.query';

@Controller('oauth2_provider')
export class Oauth2ProviderController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('v1/add_provider')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  async addProvider(@Body() payload: OAuth2ProviderDto) {
    return await this.commandBus.execute(new AddOAuth2ProviderCommand(payload));
  }

  @Post('v1/remove_provider/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async removeProvider(@Param('uuid') uuid, @Req() req) {
    const user = req.token.sub;
    return await this.commandBus.execute(
      new RemoveOAuth2ProviderCommand(uuid, user),
    );
  }

  @Post('v1/update_provider/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  @UsePipes(ValidationPipe)
  async updateProvider(
    @Param('uuid') uuid,
    @Body() payload: OAuth2ProviderDto,
  ) {
    return await this.commandBus.execute(
      new UpdateOAuth2ProviderCommand(uuid, payload),
    );
  }

  @Get('v1/retrieve_provider/:uuid')
  @UseGuards(TokenGuard)
  async retrieveProvider(@Param('uuid') uuid) {
    return await this.queryBus.execute(new RetrieveOAuth2ProviderQuery(uuid));
  }

  @Get('v1/list')
  @UseGuards(TokenGuard)
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return await this.queryBus.execute(
      new ListOAuth2ProviderQuery(offset, limit, search, sort),
    );
  }
}
