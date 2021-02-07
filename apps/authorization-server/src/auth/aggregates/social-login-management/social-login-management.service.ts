import { Injectable, NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { SocialLoginRemovedEvent } from '../../events/social-login-removed/social-login-removed.event';
import { SocialLoginUserSignedUpEvent } from '../../events';
import { UserService } from '../../../user-management/entities/user/user.service';
import { CreateSocialLoginDto } from '../../controllers/social-login/social-login-create.dto';
import { SocialLoginAddedEvent } from '../../events/social-login-added/social-login-added.event';
import { SocialLogin } from '../../entities/social-login/social-login.interface';
import { SocialLoginModifiedEvent } from '../../events/social-login-modified/social-login-modified.event';

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
    isEmailVerified: boolean,
  ) {
    this.apply(new SocialLoginUserSignedUpEvent(email, name, socialLogin));
    return await this.userService.save({ email, name, isEmailVerified });
  }

  async removeSocialLogin(uuid: string, userUuid: string) {
    const socialLogin = await this.socialLoginService.findOne({ uuid });
    if (socialLogin) {
      this.apply(new SocialLoginRemovedEvent(userUuid, socialLogin));
    } else {
      throw new NotFoundException();
    }
  }

  async addSocialLogin(payload: CreateSocialLoginDto, createdBy: string) {
    const params = {
      ...payload,
      ...{
        createdBy,
        creation: new Date(),
      },
    } as SocialLogin;
    this.apply(new SocialLoginAddedEvent(params));
    return params;
  }

  async modifySocialLogin(payload: CreateSocialLoginDto, uuid: string) {
    const socialLogin = await this.socialLoginService.findOne({ uuid });
    Object.assign(socialLogin, payload);
    socialLogin.modified = new Date();
    this.apply(new SocialLoginModifiedEvent(socialLogin));
    return socialLogin;
  }
}
