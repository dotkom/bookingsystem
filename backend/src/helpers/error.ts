export class ErrorHandler extends Error {
  statusCode: number;
  extra: object | string;
  constructor(
    statusCode: number,
    message: string,
    extra?: object | string,
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.extra = extra;
  }
}
export const handleError = (err, res) => {
  const { statusCode, message, extra } = err;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    extra,
  });
};
