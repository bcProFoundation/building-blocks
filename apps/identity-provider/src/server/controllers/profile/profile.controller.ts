import {
  Controller,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
} from '@nestjs/common';
import { ProfileService } from '../../models/profile/profile.service';
import { PersonalDetailsDTO } from './personal-details-dto';
import { BearerTokenStatus } from '../../decorators/bearer-token-status.decorator';
import { Profile } from '../../models/profile/profile.entity';
import { PersonalSecondDetailsDTO } from './personal-second-details-dto';
import { INDEX_HTML } from '../../constants/filesystem';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  profile(@Res() res) {
    return res.sendFile(INDEX_HTML);
  }

  @Post('v1/update_profile_details')
  @UsePipes(ValidationPipe)
  async updateSecondProfile(
    @Body() profile: PersonalSecondDetailsDTO,
    @Res() res,
    @BearerTokenStatus() tokenStatus,
  ) {
    if (tokenStatus.active) {
      let updatedProfile: Profile;
      if (profile.uuid) {
        updatedProfile = await this.profileService.findOne({
          uuid: profile.uuid,
        });

        if (!updatedProfile) updatedProfile = new Profile();
        Object.assign(updatedProfile, profile);
        await updatedProfile.save();
      } else {
        updatedProfile = await this.profileService.save(profile);
      }
      res.json(updatedProfile);
    } else {
      res.json({ message: 'Token Expired' });
    }
  }

  @Post('v1/update_personal_details')
  @UsePipes(ValidationPipe)
  async updateProfile(
    @Body() profile: PersonalDetailsDTO,
    @BearerTokenStatus() tokenStatus,
    @Res() res,
  ) {
    if (tokenStatus.active) {
      let updatedProfile: Profile;
      if (profile.uuid) {
        updatedProfile = await this.profileService.findOne({
          uuid: profile.uuid,
        });

        if (!updatedProfile) updatedProfile = new Profile();
        Object.assign(updatedProfile, profile);
        updatedProfile.birthdate = new Date(profile.birthdate);
        await updatedProfile.save();
      } else {
        updatedProfile = await this.profileService.save(profile);
      }
      res.json(updatedProfile);
    } else {
      res.json({ message: 'Token Expired' });
    }
  }

  @Get('v1/get_personal_details/:uuid')
  async getPersonalDetails(
    @Res() res,
    @BearerTokenStatus() tokenStatus,
    @Param('uuid') uuid,
  ) {
    if (tokenStatus.active) {
      const profile = await this.profileService.findOne({ uuid });
      res.json(profile);
    }
  }

  @Get('v1/get_profile_details/:uuid')
  async getProfileDetails(
    @Res() res,
    @BearerTokenStatus() tokenStatus,
    @Param('uuid') uuid,
  ) {
    if (tokenStatus.active) {
      const profile = await this.profileService.findOne({ uuid });
      res.json(profile);
    }
  }
}
