import { Injectable } from '@nestjs/common';
import { APP_NAME } from './constants/messages';
import { INDEX_HTML } from './constants/filesystem';

@Injectable()
export class AppService {
  info() {
    return { message: APP_NAME };
  }

  login(req, res) {
    if (!req.isAuthenticated()) {
      res.sendFile(INDEX_HTML);
    } else {
      res.redirect(req.query.redirect || '/account');
    }
  }
}
