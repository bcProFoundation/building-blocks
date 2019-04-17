import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const response = host.switchToHttp().getResponse();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.FORBIDDEN) {
      response.redirect(
        '/login?redirect=' + encodeURIComponent(request.originalUrl),
      );
    }

    if (status === HttpStatus.NOT_FOUND) {
      response.status(status).render('404');
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const message = error.message;
      response.status(status).json({ error: message });
    }
  }
}
