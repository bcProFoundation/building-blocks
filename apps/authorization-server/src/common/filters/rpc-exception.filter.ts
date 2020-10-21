import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    return throwError(exception);
  }
}
