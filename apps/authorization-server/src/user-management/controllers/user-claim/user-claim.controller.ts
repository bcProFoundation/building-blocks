import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { GetUserClaimsQuery } from '../../queries/get-user-claims/get-user-claims.query';
import { RpcExceptionFilter } from '../../../common/filters/rpc-exception.filter';
import { AddUserClaimCommand } from '../../commands/add-user-claim/add-user-claim.command';
import { RemoveUserClaimCommand } from '../../commands/remove-user-claim/remove-user-claim.command';
import { UpdateUserClaimCommand } from '../../commands/update-user-claim/update-user-claim.command';
import { ListUserClaimsDto } from './list-user-claims.dto';
import { UserClaimDto } from './user-claim.dto';
import { BearerTokenGuard } from '../../../auth/guards/bearer-token.guard';

export const UserClaimsAddedByServiceEvent = 'UserClaimsAddedByServiceEvent';
export const UserClaimsUpdatedByServiceEvent =
  'UserClaimsUpdatedByServiceEvent';
export const UserClaimsRemovedByServiceEvent =
  'UserClaimsRemovedByServiceEvent';

@Controller('user_claim')
export class UserClaimController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseFilters(new RpcExceptionFilter())
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  @EventPattern(UserClaimsAddedByServiceEvent)
  async addUserClaim(@Payload() payload: UserClaimDto) {
    return await this.commandBus.execute(new AddUserClaimCommand(payload));
  }

  @UseFilters(new RpcExceptionFilter())
  @EventPattern(UserClaimsUpdatedByServiceEvent)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async updateUserClaim(@Payload() payload: UserClaimDto) {
    return await this.commandBus.execute(new UpdateUserClaimCommand(payload));
  }

  @UseFilters(new RpcExceptionFilter())
  @EventPattern(UserClaimsRemovedByServiceEvent)
  async removeUserClaim(@Payload() payload: { uuid: string; name: string }) {
    return await this.commandBus.execute(
      new RemoveUserClaimCommand(payload.uuid, payload.name),
    );
  }

  @Post('v1/add_user_claim')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async addUserClaimHttp(@Body() payload: UserClaimDto) {
    return await this.commandBus.execute(new AddUserClaimCommand(payload));
  }

  @Post('v1/update_user_claim')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async updateUserClaimHttp(@Body() payload: UserClaimDto) {
    return await this.commandBus.execute(new UpdateUserClaimCommand(payload));
  }

  @Post('v1/remove_user_claim')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  async removeUserClaimHttp(@Body() payload: { uuid: string; name: string }) {
    return await this.commandBus.execute(
      new RemoveUserClaimCommand(payload.uuid, payload.name),
    );
  }

  @Get('v1/retrieve_user_claims')
  @Roles(ADMINISTRATOR)
  @UseGuards(BearerTokenGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true }))
  async listUserClaims(@Query() query: ListUserClaimsDto) {
    return await this.queryBus.execute(
      new GetUserClaimsQuery(query.uuid, query.offset, query.limit),
    );
  }
}
