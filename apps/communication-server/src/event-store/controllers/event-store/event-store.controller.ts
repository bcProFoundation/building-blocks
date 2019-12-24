import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { EventListQueryDto } from './list-query-dto';
import { ListEventsQuery } from '../../queries/list-event.query';
import { NodeEventStoreAccessDeniedExceptionFilter } from '../../../common/filters/node-eventstore-access-denied.filter';

@Controller('event_store')
export class EventStoreController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('v1/list')
  @UseFilters(new NodeEventStoreAccessDeniedExceptionFilter())
  @Roles(ADMINISTRATOR)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @UseGuards(TokenGuard, RoleGuard)
  async link(@Query() query: EventListQueryDto) {
    return await this.queryBus.execute(new ListEventsQuery(query));
  }
}