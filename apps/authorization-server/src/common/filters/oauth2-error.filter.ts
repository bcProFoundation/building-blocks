import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { OAuth2Error } from 'oauth2orize';

@Catch(OAuth2Error)
export class OAuth2ErrorFilter implements ExceptionFilter {
  catch(error: OAuth2Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(error.status).json({ error: error.message });
  }
}
