import { Injectable } from '@nestjs/common';
import { i18n } from './i18n/i18n.config';
import { INDEX_HTML } from './constants/app-strings';

@Injectable()
export class AppService {
  info(req?) {
    return {
      message: i18n.__('Authorization Server'),
      session: req.isAuthenticated(),
    };
  }

  login(req, res) {
    if (!req.isAuthenticated()) {
      res.sendFile(INDEX_HTML);
    } else {
      res.redirect(req.query.redirect || '/account');
    }
  }
}
