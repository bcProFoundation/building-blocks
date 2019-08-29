import { Injectable, NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { SocialLoginRemovedEvent } from '../../events/social-login-removed/social-login-removed.event';
import { SocialLoginUserSignedUpEvent } from '../../events';
import { UserService } from '../../../user-management/entities/user/user.service';

@Injectable()
export class SocialLoginManagementService extends AggregateRoot {
  constructor(
    private readonly socialLoginService: SocialLoginService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async signUpSocialLoginUser(
    email: string,
    name: string,
    socialLogin: string,
  ) {
    this.apply(new SocialLoginUserSignedUpEvent(email, name, socialLogin));
    return await this.userService.save({ email, name });
  }

  async removeSocialLogin(uuid: string, userUuid: string) {
    const socialLogin = await this.socialLoginService.findOne({ uuid });
    if (socialLogin) {
      this.apply(new SocialLoginRemovedEvent(userUuid, socialLogin));
    } else {
      throw new NotFoundException();
    }
  }
}
