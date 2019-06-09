import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Profile } from './profile.entity';
import { AVATAR_IMAGE_FOLDER } from '../../../constants/filesystem';
import { unlink } from 'fs';
import { from } from 'rxjs';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: MongoRepository<Profile>,
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

  public deleteAvatarFile(pictureFile) {
    unlink(AVATAR_IMAGE_FOLDER + '/' + pictureFile, () => {});
  }

  public deleteProfile(uuid) {
    return from(this.profileRepository.deleteOne({ uuid }));
  }
}
