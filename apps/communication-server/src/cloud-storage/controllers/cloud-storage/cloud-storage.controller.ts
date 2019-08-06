import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Param,
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
import { StorageService } from '../../entities/storage/storage.service';
import { StorageValidationDto } from '../../policies';
import { AddCloudStorageCommand } from '../../commands/add-cloud-storage/add-cloud-storage.command';
import { ModifyCloudStorageCommand } from '../../commands/modify-cloud-storage/modify-cloud-storage.command';
import { RemoveCloudStorageCommand } from '../../commands/remove-cloud-storage/remove-cloud-storage.command';
import { ModifyStorageDto } from '../../policies/modify-cloud-storage-dto/modify-cloud-storage-dto';
import { UploadFilesCloudBucketCommand } from '../../commands/upload-files-cloud-bucket/upload-files-cloud-bucket.command';
import { Storage } from '../../entities/storage/storage.entity';
import { DeleteFileFromStorageCommand } from '../../commands/delete-file-from-storage/delete-file-from-storage.command';
import { INVALID_FILE_OR_STORAGE_UUID } from '../../../constants/messages';

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

  @Get('v1/get/:uuid')
  @UseGuards(TokenGuard)
  async findOne(@Param('uuid') uuid: string) {
    const storage: Storage = await this.storage.findOne({ uuid });
    if (!storage) throw new BadRequestException(INVALID_FILE_OR_STORAGE_UUID);
    storage.accessKey = undefined;
    storage.secretKey = undefined;
    return storage;
  }

  @Post('v1/add')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async addStorage(@Body() payload: StorageValidationDto, @Req() req) {
    return this.commandBus.execute(new AddCloudStorageCommand(payload));
  }

  @Post('v1/modify/:uuid')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async modifyStorage(@Body() payload: ModifyStorageDto, @Param('uuid') uuid) {
    return this.commandBus.execute(
      new ModifyCloudStorageCommand(uuid, payload),
    );
  }

  @Post('v1/remove/:uuid')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Roles(ADMINISTRATOR)
  @UseGuards(TokenGuard, RoleGuard)
  async removeStorage(@Param() uuid, @Req() req) {
    const actorUuid = req.user.user;
    return this.commandBus.execute(
      new RemoveCloudStorageCommand(actorUuid, uuid),
    );
  }

  @Post('v1/upload_file/:uuid')
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile('file') file,
    @Req() req,
    @Body('permission') permission,
    @Param('uuid') storageUuid,
  ) {
    return this.commandBus.execute(
      new UploadFilesCloudBucketCommand(file, storageUuid, req, permission),
    );
  }

  @Post('v1/delete_file/:uuid')
  @UseGuards(TokenGuard)
  async deleteFile(
    @Body('filename') filename,
    @Req() req,
    @Param('uuid') storageUuid,
  ) {
    return this.commandBus.execute(
      new DeleteFileFromStorageCommand(filename, storageUuid, req),
    );
  }
}
