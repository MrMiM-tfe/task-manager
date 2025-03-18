import {
	ArgumentsHost,
	Catch,
	ConflictException,
	ExceptionFilter,
	HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
	catch(exception: QueryFailedError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const { driverError } = exception as any;
		console.log(exception);
		
		let statusCode = HttpStatus.BAD_REQUEST;
		let message = 'Database error occurred';
		
		// handle duplicate unique key errors
		if (driverError.code === 'ER_DUP_ENTRY') {
			message = driverError.sqlMessage
			statusCode = HttpStatus.CONFLICT;
		}
		
		// null constraint violation
		if (driverError.code === '23502') {
			message = `${driverError.column} cannot be null`;
		}
		
		response.status(statusCode).json({
			statusCode,
			message: message,
		});
	}
}