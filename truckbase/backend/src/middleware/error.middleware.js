const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const error = {
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  };

  // Prisma known errors
  if (err.code === 'P2002') {
    error.message = 'A record with this value already exists';
    error.status = 409;
  } else if (err.code === 'P2025') {
    error.message = 'Record not found';
    error.status = 404;
  }

  res.status(err.status || 500).json(error);
};

module.exports = { errorHandler };
