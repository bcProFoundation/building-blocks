import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Param,
  Put,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { StorageListingDto } from '../../../cloud-storage/policies/storage-listing-validation/storage-listing.dto';
import { StorageService } from '../../../cloud-storage/entities/storage/storage.service';
import { StorageValidationDto } from '../../../cloud-storage/policies';
import { AddCloudStorageCommand } from '../../../cloud-storage/commands/add-cloud-storage/add-cloud-storage.command';
import { ModifyCloudStorageCommand } from '../../../cloud-storage/commands/modify-cloud-storage/modify-cloud-storage.command';
import { RemoveCloudStorageCommand } from '../../../cloud-storage/commands/remove-cloud-storage/remove-cloud-storage.command';

@Controller('storage')
export class CloudStorageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly storage: StorageService,
  ) {}

  @Get('v1/list')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() query: StorageListingDto) {
    const skip = Number(query.skip);
    const take = Number(query.take);
    const emailAccounts = await this.storage.list(skip, take);
    return emailAccounts;
  }

  @Get('v1/retrieve/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async findOne(@Param('uuid') uuid: string) {
    return await this.storage.findOne({ uuid });
  }

  @Post('v1/add')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async addStorage(payload: StorageValidationDto, @Req() req) {
    const actorUuid = req.user.user;
    return this.commandBus.execute(
      new AddCloudStorageCommand(actorUuid, payload),
    );
  }

  @Put('v1/modify/:uuid')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async modifyStorage(
    payload: StorageValidationDto,
    @Param('uuid') uuid,
    @Req() req,
  ) {
    const actorUuid = req.user.user;
    return this.commandBus.execute(
      new ModifyCloudStorageCommand(actorUuid, uuid, payload),
    );
  }

  @Delete('v1/remove/:uuid')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async removeStorage(@Param() uuid, @Req() req) {
    const actorUuid = req.user.user;
    return this.commandBus.execute(
      new RemoveCloudStorageCommand(actorUuid, uuid),
    );
  }
}
