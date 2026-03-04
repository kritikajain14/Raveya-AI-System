export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Default error
  let statusCode = 500;
  let message = 'Internal server error';
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  
  // Custom AI service errors
  if (err.message.includes('AI service error')) {
    statusCode = 503;
    message = err.message;
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};