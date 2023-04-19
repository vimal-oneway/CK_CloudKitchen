export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    // Error.captureStackTrace(this, this.constructor);
  }
}
