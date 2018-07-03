import { Injectable, HttpException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { UserService } from 'models/user/user.service';
import { User } from 'models/user/user.entity';
import { ConfigService } from 'config/config.service';

const config = new ConfigService();

@Injectable()
export class IDPStrategy extends PassportStrategy(Strategy) {
  _oauth2: any;
  constructor(private readonly userService: UserService) {
    super(config.getOAuth2Client());
  }

  async validate(accessToken, refreshToken, profile, verified) {
    // find or create user from profile verified(err, user, info)
    try {
      let user;
      user = await this.userService.findOne({ email: profile.email });
      if (!user) {
        user = new User();
        user.name = profile.name;
        user.email = profile.email;
        user.profileId = profile.id;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.save();
      }

      // save tokens
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.save();

      verified(null, user, null);
    } catch (error) {
      verified(error);
    }
  }

  async userProfile(accessToken, done) {
    this._oauth2.get(
      config.getOAuth2Client().profileURL,
      accessToken,
      (err, body, res) => {
        if (err) {
          return done(new HttpException('failed to fetch user profile', err));
        }
        try {
          const json = JSON.parse(body);
          const profile: any = { provider: 'idp' };
          profile.id = json.id;
          profile.name = json.name;
          profile.email = json.email;

          done(null, profile);
        } catch (e) {
          done(e);
        }
      },
    );
  }
}
