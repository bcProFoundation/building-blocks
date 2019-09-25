import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { AccessDeniedError } from 'node-eventstore-client';
import { Response } from 'express';

@Catch(AccessDeniedError)
export class NodeEventStoreAccessDeniedExceptionFilter
  implements ExceptionFilter {
  catch(exception: AccessDeniedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.FORBIDDEN).json({
      statusCode: HttpStatus.FORBIDDEN,
      message: exception.message,
    });
  }
}
