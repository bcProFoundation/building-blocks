import { Injectable, NestMiddleware } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class SSRMiddleware implements NestMiddleware {
  public resolve(...args: any[]) {
    return (req, res, next) => {
      res.sendFile(join(process.cwd(), 'dist', 'identity-provider/index.html'));
      next();
    };
  }
}
