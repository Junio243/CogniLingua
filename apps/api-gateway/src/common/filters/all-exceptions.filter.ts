import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : null;

    const message = (exceptionResponse as any)?.message
      ? Array.isArray((exceptionResponse as any).message)
        ? (exceptionResponse as any).message.join(', ')
        : (exceptionResponse as any).message
      : exception instanceof Error
        ? exception.message
        : 'Internal server error';

    const error = (exceptionResponse as any)?.error
      ? (exceptionResponse as any).error
      : isHttpException
        ? (exception as HttpException).name
        : 'InternalServerError';

    this.logger.error(
      JSON.stringify({
        event: 'request_error',
        method: request.method,
        path: request.url,
        statusCode: status,
        message,
        error,
      }),
    );

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
