import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message,
            error: exception.name,
            details: exception.getResponse(),
        };

        this.logger.error(
            `[${request.method}] ${request.url} - ${status} ${this.getErrorMessage(status, exception.message)}`,
            {
                request: {
                    method: request.method,
                    url: request.url,
                    headers: this.sanitizeHeaders(request.headers),
                    body: request.body,
                    query: request.query,
                    params: request.params,
                },
                error: {
                    status,
                    message: this.getErrorMessage(status, exception.message),
                    type: exception.name,
                    details: this.getErrorDetails(exception),
                },
                timestamp: errorResponse.timestamp,
            }
        );

        response.status(status).json({
            success: false,
            error: {
                code: status,
                message: this.getErrorMessage(status, exception.message),
                details: this.getErrorDetails(exception),
            },
            timestamp: errorResponse.timestamp,
            path: errorResponse.path,
        });
    }

    private getErrorMessage(status: number, message: string): string {
        switch (status) {
            case HttpStatus.NOT_FOUND:
                return 'Recurso não encontrado';
            case HttpStatus.BAD_REQUEST:
                return 'Requisição inválida';
            case HttpStatus.UNAUTHORIZED:
                return 'Não autorizado';
            case HttpStatus.FORBIDDEN:
                return 'Acesso negado';
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return 'Erro interno do servidor';
            default:
                return message || 'Ocorreu um erro';
        }
    }

    private getErrorDetails(exception: HttpException): any {
        const response = exception.getResponse();
        if (typeof response === 'object') {
            return response;
        }
        return { message: response };
    }

    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };
        // Remove headers sensíveis
        delete sanitized.authorization;
        delete sanitized.cookie;
        return sanitized;
    }
} 