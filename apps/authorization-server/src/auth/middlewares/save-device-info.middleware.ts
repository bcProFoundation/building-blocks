import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SaveDeviceInfoMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.session) {
      req.session.userAgent = req.header('User-Agent');
    }
    next();
  }
}
