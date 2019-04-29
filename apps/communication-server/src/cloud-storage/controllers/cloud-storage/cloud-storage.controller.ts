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
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { ADMINISTRATOR } from '../../../constants/app-strings';
import { RoleGuard } from '../../../auth/guards/role.guard';
import { StorageService } from '../../../cloud-storage/entities/storage/storage.service';
import { StorageValidationDto } from '../../../cloud-storage/policies';
import { AddCloudStorageCommand } from '../../../cloud-storage/commands/add-cloud-storage/add-cloud-storage.command';
import { ModifyCloudStorageCommand } from '../../../cloud-storage/commands/modify-cloud-storage/modify-cloud-storage.command';
import { RemoveCloudStorageCommand } from '../../../cloud-storage/commands/remove-cloud-storage/remove-cloud-storage.command';
import { ModifyStorageDto } from '../../policies/modify-cloud-storage-dto/modify-cloud-storage-dto';
import { UploadFilesCloudBucketCommand } from '../../commands/upload-files-cloud-bucket/upload-files-cloud-bucket.command';
import { Storage } from '../../../cloud-storage/entities/storage/storage.entity';

@Controller('storage')
export class CloudStorageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly storage: StorageService,
  ) {}

  @Get('v1/list')
  @UseGuards(TokenGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    const skip = Number(offset);
    const take = Number(limit);
    return await this.storage.list(skip, take);
  }

  @Get('v1/getOne/:uuid')
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async findOne(@Param('uuid') uuid: string) {
    const storage: Storage = await this.storage.findOne({ uuid });
    storage.accessKey = undefined;
    storage.secretKey = undefined;
    return storage;
  }

  @Post('v1/add')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async addStorage(@Body() payload: StorageValidationDto, @Req() req) {
    return this.commandBus.execute(new AddCloudStorageCommand(payload));
  }

  @Put('v1/modify/:uuid')
  @UsePipes(ValidationPipe)
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async modifyStorage(@Body() payload: ModifyStorageDto, @Param('uuid') uuid) {
    return this.commandBus.execute(
      new ModifyCloudStorageCommand(uuid, payload),
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

  @Post('cloud/uploadFile/:uuid')
  @UseInterceptors(FileInterceptor('file'))
  async testing(
    @UploadedFile('file') file,
    @Req() req,
    @Body('permission') permission,
    @Param('uuid') storageUuid,
  ) {
    const cloudStorageSettings = await this.storage.findOne({
      uuid: storageUuid,
    });
    if (!file || !cloudStorageSettings) {
      throw new BadRequestException('Invalid Request bad file or uuid');
    }
    return this.commandBus.execute(
      new UploadFilesCloudBucketCommand(
        file,
        cloudStorageSettings,
        req,
        permission,
      ),
    );
  }
}
