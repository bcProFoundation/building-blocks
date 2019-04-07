import {
  Controller,
  Get,
  Req,
  Query,
  Param,
  Post,
  ValidationPipe,
  UsePipes,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ListServiceTypesQuery } from '../../queries/list-service-types/list-service-types.query';
import { GetServiceTypeByNameQuery } from '../../queries/get-service-type-by-name/get-service-type-by-name.query';
import { GetServiceTypeByUuidQuery } from '../../queries/get-service-type-by-uuid/get-service-type-by-uuid.query';
import { ServiceTypeValidationDto } from '../../policies/service-type-validation/service-type-validation.dto';
import { AddServiceTypeCommand } from '../../commands/add-service-type/add-service-type.command';
import { RemoveServiceTypeCommand } from '../../commands/remove-service-type/remove-service-type.command';
import { Request } from 'express';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';

@Controller('service_type')
export class ServiceTypeController {
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
      new ListServiceTypesQuery(offset, limit, search, sort),
    );
  }

  @Get('v1/get_by_name/:name')
  async getServiceTypeByName(@Param('name') name: string) {
    return await this.queryBus.execute(new GetServiceTypeByNameQuery(name));
  }

  @Get('v1/get_by_uuid/:uuid')
  async getServiceTypeByUuid(@Param('uuid') uuid: string) {
    return await this.queryBus.execute(new GetServiceTypeByUuidQuery(uuid));
  }

  @Post('v1/create')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async registerService(@Body() payload: ServiceTypeValidationDto) {
    return await this.commandBus.execute(new AddServiceTypeCommand(payload));
  }

  @Post('v1/delete/:name')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async deleteService(@Param('name') name: string) {
    return await this.commandBus.execute(new RemoveServiceTypeCommand(name));
  }
}
