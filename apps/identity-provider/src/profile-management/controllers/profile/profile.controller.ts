import {
  Controller,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
  Param,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from '../../../profile-management/entities/profile/profile.service';
import { PersonalDetailsDTO } from './personal-details-dto';
import { Profile } from '../../../profile-management/entities/profile/profile.entity';
import { ProfileDetailsDTO } from './profile-details-dto';
import { TokenGuard } from '../../../auth/guards/token.guard';
import { multerAvatarConnection } from './multer-avatar.connection';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('v1/update_profile_details')
  @UseGuards(TokenGuard)
  @UsePipes(ValidationPipe)
  async updateProfileDetails(@Body() profile: ProfileDetailsDTO, @Req() req) {
    let updatedProfile: Profile;
    if (profile.uuid && profile.uuid === req.token.sub) {
      updatedProfile = await this.profileService.findOne({
        uuid: profile.uuid,
      });

      if (!updatedProfile) updatedProfile = new Profile();
      Object.assign(updatedProfile, profile);
      await updatedProfile.save();
    } else {
      if (req.token.sub) profile.uuid = req.token.sub;
      updatedProfile = await this.profileService.save(profile);
    }
    return updatedProfile;
  }

  @Post('v1/update_personal_details')
  @UseGuards(TokenGuard)
  @UsePipes(ValidationPipe)
  async updateProfile(
    @Body() profile: PersonalDetailsDTO,
    @Req() req,
    @Res() res,
  ) {
    if (req.token.active) {
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
  @UseGuards(TokenGuard)
  async getPersonalDetails(@Req() req, @Res() res, @Param('uuid') uuid) {
    if (req.token.active && req.token.sub === uuid) {
      const profile = await this.profileService.findOne({ uuid });
      res.json(profile);
    } else throw new UnauthorizedException();
  }

  @Get('v1/get_profile_details/:uuid')
  @UseGuards(TokenGuard)
  async getProfileDetails(@Req() req, @Res() res, @Param('uuid') uuid) {
    if (req.token.active && req.token.sub === uuid) {
      const profile = await this.profileService.findOne({ uuid });
      res.json(profile);
    } else throw new UnauthorizedException();
  }

  @Post('v1/upload_avatar')
  @UseGuards(TokenGuard)
  @UseInterceptors(FileInterceptor('file', multerAvatarConnection))
  async uploadFile(@Req() req, @Res() res, @UploadedFile('file') file) {
    if (req.token.active) {
      const uploadResponse = await this.profileService.uploadAndSetAvatar(
        file,
        req,
      );
      res.json(uploadResponse);
    }
  }

  @Delete('v1/delete_avatar')
  @UseGuards(TokenGuard)
  async deleteAvatar(@Req() req) {
    const profile = await this.profileService.findOne({
      uuid: req.token.sub,
    });
    if (profile.picture) {
      this.profileService.deleteAvatarFile(profile.picture.split('/')[2]);
      profile.picture = undefined;
      return await profile.save();
    }
  }
}
