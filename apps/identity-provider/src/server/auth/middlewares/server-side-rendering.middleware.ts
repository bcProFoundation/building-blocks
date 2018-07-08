import { Injectable, NestMiddleware } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class ServerSideRenderingMiddleware implements NestMiddleware {
  renderCache: {} = {};
  resolve() {
    return (req, res) => {
      if (this.renderCache[req.originalUrl]) {
        return res.send(this.renderCache[req.originalUrl]);
      }
      res.render(
        join(__dirname, '..', '..', '..', 'dist', 'identity-provider', 'index'),
        { req },
        (err, html) => {
          // prevent caching these routes
          if (req.originalUrl.startsWith('/admin')) {
            return res.send(html);
          } else {
            this.renderCache[req.originalUrl] = html;
            return res.send(html);
          }
        },
      );
    };
  }
}
