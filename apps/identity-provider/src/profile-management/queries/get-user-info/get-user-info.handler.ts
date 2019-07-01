import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotImplementedException } from '@nestjs/common';
import { GetUserInfoQuery } from './get-user-info.query';
import { ProfileService } from '../../entities/profile/profile.service';
import { PLEASE_RUN_SETUP } from '../../../constants/messages';
import { IDTokenClaims } from '../../../auth/entities/token-cache/id-token-claims.interfaces';
import { PROFILE } from '../../../constants/app-strings';
import { ServerSettingsService } from '../../../system-settings/entities/server-settings/server-settings.service';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoHandler implements IQueryHandler<GetUserInfoQuery> {
  constructor(
    private readonly profileService: ProfileService,
    private readonly settings: ServerSettingsService,
  ) {}
  async execute(query: GetUserInfoQuery) {
    const settings = await this.settings.find();
    const scopedProfile: IDTokenClaims = {};

    if (!settings) {
      throw new NotImplementedException(PLEASE_RUN_SETUP);
    }

    const { token } = query;
    const profile = await this.profileService.findOne({ uuid: token.sub });

    if (profile && token.scope.includes(PROFILE)) {
      scopedProfile.aud = token.clientId;
      if (profile.familyName) scopedProfile.family_name = profile.familyName;
      if (profile.givenName) scopedProfile.given_name = profile.givenName;
      if (profile.middleName) scopedProfile.middle_name = profile.middleName;
      if (profile.nickname) scopedProfile.nickname = profile.nickname;
      if (profile.preferredUsername) {
        scopedProfile.preferred_username = profile.preferredUsername;
      }
      if (profile.profile) scopedProfile.profile = profile.profile;
      if (profile.picture) scopedProfile.picture = profile.picture;
      if (profile.website) scopedProfile.website = profile.website;
      if (profile.gender) scopedProfile.gender = profile.gender;
      if (profile.birthdate) scopedProfile.birthdate = profile.birthdate;
      if (profile.zoneinfo) scopedProfile.zoneinfo = profile.zoneinfo;
      if (profile.locale) scopedProfile.locale = profile.locale;
      if (profile.modified) scopedProfile.updated_at = profile.modified;
    }

    return scopedProfile;
  }
}
