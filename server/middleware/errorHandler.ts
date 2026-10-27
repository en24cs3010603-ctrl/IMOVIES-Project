import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  errors?: Record<string, any>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found or invalid identifier format.';
  }

  // Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists.`;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val: any) => val.message);
    message = messages.join('. ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
