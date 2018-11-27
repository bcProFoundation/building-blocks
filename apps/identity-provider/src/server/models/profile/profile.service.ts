import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { AVATAR_ROUTE_PREFIX } from '../../constants/filesystem';

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

  public async findOne(params): Promise<any> {
    return await this.profileRepository.findOne(params);
  }

  public async find() {
    return await this.profileRepository.find();
  }

  public async uploadAndSetAvatar(file, profileUuid) {
    const profile: Profile = await this.findOne({ uuid: profileUuid });
    profile.picture = AVATAR_ROUTE_PREFIX + file.filename;
    await profile.save();
    return profile;
  }
}
