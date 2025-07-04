import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = exception.getResponse() as string | { message: string | string[]; error: string };

    const message = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message;

    const error = typeof exceptionResponse === 'string' ? null : exceptionResponse['error'];

    this.logger.error(`[${request.method}] ${request.url} → ${status} - ${Array.isArray(message) ? message.join(', ') : message}`);

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
      error,
      statusCode: status
    });
  }
}
