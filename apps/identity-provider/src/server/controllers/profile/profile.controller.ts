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

@Controller('profile/v1')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('update_personal_details')
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

  @Get('get_personal_details/:uuid')
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
}
