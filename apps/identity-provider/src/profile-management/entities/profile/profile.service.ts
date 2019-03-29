import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Profile } from './profile.entity';
import { AVATAR_IMAGE_FOLDER } from '../../../constants/filesystem';
import { unlink } from 'fs';
import { from } from 'rxjs';
import { CommandBus } from '@nestjs/cqrs';
import { UploadNewAvatarCommand } from '../../../profile-management/commands/upload-new-avatar/upload-new-avatar.command';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: MongoRepository<Profile>,
    private readonly commandBus: CommandBus,
  ) {}

  public async save(profile) {
    return await this.profileRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find();
  }

  public async findOne(params): Promise<Profile> {
    return await this.profileRepository.findOne(params);
  }

  public async find() {
    return await this.profileRepository.find();
  }

  public async uploadAndSetAvatar(file, clientHttpRequest) {
    return this.commandBus.execute(
      new UploadNewAvatarCommand(file, clientHttpRequest),
    );
  }

  public deleteAvatarFile(pictureFile) {
    unlink(AVATAR_IMAGE_FOLDER + '/' + pictureFile, () => {});
  }

  public deleteProfile(uuid) {
    return from(this.profileRepository.deleteOne({ uuid }));
  }
}
