import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { TokenError } from 'oauth2orize';

@Catch(TokenError)
export class TokenErrorFilter implements ExceptionFilter {
  catch(error: TokenError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(error.status).json({ error: error.message });
  }
}
