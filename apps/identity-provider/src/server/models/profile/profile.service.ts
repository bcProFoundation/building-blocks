import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import {
  AVATAR_ROUTE_PREFIX,
  AVATAR_IMAGE_FOLDER,
} from '../../constants/filesystem';
import { unlink } from 'fs';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
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

  public async uploadAndSetAvatar(file, profileUuid) {
    const profile: Profile = await this.findOne({ uuid: profileUuid });
    if (profile && profile.picture) {
      const oldPicture = profile.picture.split('/')[2];
      this.deleteAvatarFile(oldPicture);

      profile.picture = AVATAR_ROUTE_PREFIX + file.filename;
      await profile.save();
      return profile;
    } else {
      profile.picture = AVATAR_ROUTE_PREFIX + file.filename;
      await profile.save();
      return profile;
    }
  }

  public deleteAvatarFile(pictureFile) {
    unlink(AVATAR_IMAGE_FOLDER + '/' + pictureFile, () => {});
  }
}
