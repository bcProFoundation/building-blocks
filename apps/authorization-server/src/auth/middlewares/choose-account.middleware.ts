import { Injectable, NestMiddleware } from '@nestjs/common';
import { stringify } from 'querystring';
import { ServerSettingsService } from '../../system-settings/entities/server-settings/server-settings.service';
import { UserService } from '../../user-management/entities/user/user.service';
import { addSessionUser } from '../guards/guard.utils';

export const ACCOUNT_CHOOSE_ROUTE = '/account/choose';
export const SELECT_ACCOUNT = 'select_account';

@Injectable()
export class ChooseAccountMiddleware implements NestMiddleware {
  constructor(
    private readonly settings: ServerSettingsService,
    private readonly user: UserService,
  ) {}

  async use(req: any, res: any, next: () => void) {
    const settings = await this.settings.findOne({});
    if (settings && !settings.enableChoosingAccount) {
      return next();
    }

    if (!req.session.users) {
      req.session.users = [];
    }

    const reqUser = req.session.users.find(user => {
      if (user.uuid === req.session.selectedUser) {
        return user;
      }
    });

    if (reqUser) {
      const user = await this.user.findOne({ uuid: reqUser.uuid });
      const users = req.session?.users;
      req.logIn(user, () => {
        req.session.users = users;
        addSessionUser(req, {
          uuid: user.uuid,
          email: user.email,
          phone: user.phone,
        });
      });
      delete req.session.selectedUser;
      return next();
    }

    if (
      settings &&
      settings.enableChoosingAccount &&
      req.query.prompt === SELECT_ACCOUNT
    ) {
      const query = stringify(req.query);
      return res.redirect(ACCOUNT_CHOOSE_ROUTE + '?' + query);
    }

    return next();
  }
}
