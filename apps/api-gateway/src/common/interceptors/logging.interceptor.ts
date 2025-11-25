import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const start = Date.now();

    const userId =
      (request.headers['x-user-id'] as string) ||
      request.body?.studentId ||
      (request.query?.studentId as string);

    const conceptId =
      (request.headers['x-concept-id'] as string) ||
      request.body?.conceptId ||
      (request.query?.conceptId as string);

    return next.handle().pipe(
      tap({
        next: () => {
          const durationMs = Date.now() - start;
          this.logger.log(
            JSON.stringify({
              event: 'request_completed',
              method: request.method,
              path: request.url,
              statusCode: response.statusCode,
              durationMs,
              userId: userId ?? null,
              conceptId: conceptId ?? null,
            }),
          );
        },
        error: (err) => {
          const durationMs = Date.now() - start;
          const statusCode = err?.status || response.statusCode || 500;
          this.logger.error(
            JSON.stringify({
              event: 'request_failed',
              method: request.method,
              path: request.url,
              statusCode,
              durationMs,
              userId: userId ?? null,
              conceptId: conceptId ?? null,
              message: err?.message,
            }),
          );
        },
      }),
    );
  }
}
