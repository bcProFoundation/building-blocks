import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { AuthorizationError } from 'oauth2orize';

@Catch(AuthorizationError)
export class AuthorizationErrorFilter implements ExceptionFilter {
  catch(error: AuthorizationError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(error.status).json({ error: error.message });
  }
}
