import {
  Controller,
  Post,
  Get,
  Query,
  Req,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ListServicesQuery } from '../../queries/list-services/list-services.query';
import { Request } from 'express';
import { GetServiceByClientIdQuery } from '../../queries/get-service-by-clientid/get-service-by-clientid.query';
import { GetServiceByUuidQuery } from '../../queries/get-service-by-uuid/get-service-by-uuid.query';
import { RegisterServiceCommand } from '../../commands/register-service/register-service.command';
import { CreateServiceDto } from '../../policies/create-service/create-service.dto';
import { ModifyServiceCommand } from '../../commands/modify-service/modify-service.command';
import { ModifyServiceDto } from '../../policies/modify-service/modify-service.dto';
import { RemoveServiceCommand } from '../../commands/remove-service/remove-service.command';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';

@Controller('service')
export class ServiceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('v1/list')
  async listServices(
    @Req() req: Request,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return await this.queryBus.execute(
      new ListServicesQuery(offset, limit, search, sort),
    );
  }

  @Get('v1/get_by_client_id/:clientId')
  async getServiceByClientId(@Param('clientId') clientId: string) {
    return await this.queryBus.execute(new GetServiceByClientIdQuery(clientId));
  }

  @Get('v1/get_by_uuid/:uuid')
  async getServiceByUuid(@Param('uuid') uuid: string) {
    return await this.queryBus.execute(new GetServiceByUuidQuery(uuid));
  }

  @Post('v1/register')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async registerService(@Body() payload: CreateServiceDto, @Req() req) {
    const token = req.token;
    return await this.commandBus.execute(
      new RegisterServiceCommand(payload, token),
    );
  }

  @Post('v1/modify/:clientId')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async modifyService(
    @Param('clientId') clientId: string,
    @Body() payload: ModifyServiceDto,
  ) {
    return await this.commandBus.execute(
      new ModifyServiceCommand(clientId, payload),
    );
  }

  @Post('v1/delete/:clientId')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async deleteService(@Param('clientId') clientId: string) {
    return await this.commandBus.execute(new RemoveServiceCommand(clientId));
  }
}
