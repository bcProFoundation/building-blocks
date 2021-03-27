import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import AuthorizationError from 'oauth2orize-openid/lib/errors/authorizationerror';

@Catch(AuthorizationError)
export class OpenIDAuthorizationErrorFilter implements ExceptionFilter {
  catch(error: AuthorizationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(error.status).json({ error: error.message });
  }
}
