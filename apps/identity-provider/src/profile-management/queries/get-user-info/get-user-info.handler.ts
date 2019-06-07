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
      scopedProfile.family_name = profile.familyName;
      scopedProfile.aud = token.clientId;
      scopedProfile.given_name = profile.givenName;
      scopedProfile.middle_name = profile.middleName;
      scopedProfile.nickname = profile.nickname;
      scopedProfile.preferred_username = profile.preferredUsername;
      scopedProfile.profile = profile.profile;
      scopedProfile.picture = profile.picture;
      scopedProfile.website = profile.website;
      scopedProfile.gender = profile.gender;
      scopedProfile.birthdate = profile.birthdate;
      scopedProfile.zoneinfo = profile.zoneinfo;
      scopedProfile.locale = profile.locale;
      scopedProfile.updated_at = profile.modified;
    }

    return scopedProfile;
  }
}
