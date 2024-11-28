import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse: any = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse = {
        statusCode: status,
        message: exception.message,
        error: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    } else {
      errorResponse = {
        statusCode: status,
        message: exception.message || 'Internal Server Error',
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    response.status(status).json(errorResponse);
  }
}
