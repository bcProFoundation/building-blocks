import { Injectable, NotFoundException } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../user-management/entities/user/user.interface';
import { UserAccountAddedEvent } from '../../../user-management/events/user-account-added/user-account-added.event';
import { CreateSocialLoginDto } from '../../controllers/social-login/social-login-create.dto';
import { SocialLogin } from '../../entities/social-login/social-login.interface';
import { SocialLoginService } from '../../entities/social-login/social-login.service';
import { SocialLoginUserSignedUpEvent } from '../../events';
import { SocialLoginAddedEvent } from '../../events/social-login-added/social-login-added.event';
import { SocialLoginModifiedEvent } from '../../events/social-login-modified/social-login-modified.event';
import { SocialLoginRemovedEvent } from '../../events/social-login-removed/social-login-removed.event';

@Injectable()
export class SocialLoginManagementService extends AggregateRoot {
  constructor(private readonly socialLoginService: SocialLoginService) {
    super();
  }

  async signUpSocialLoginUser(
    email: string,
    name: string,
    socialLogin: string,
    isEmailVerified: boolean,
  ) {
    const uuid = uuidv4();
    this.apply(new SocialLoginUserSignedUpEvent(email, name, socialLogin));
    return this.apply(
      new UserAccountAddedEvent({ email, name, isEmailVerified, uuid } as User),
    );
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
