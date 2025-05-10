import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap({
                error: (error) => {
                    if (error instanceof NotFoundException) {
                        const ctx = context.switchToHttp();
                        const request = ctx.getRequest();
                        const response = ctx.getResponse();

                        response.status(404).json({
                            success: false,
                            error: {
                                code: 404,
                                message: 'Rota não encontrada',
                                details: {
                                    path: request.url,
                                    method: request.method,
                                },
                            },
                            timestamp: new Date().toISOString(),
                            path: request.url,
                        });
                    }
                },
            }),
        );
    }
} 