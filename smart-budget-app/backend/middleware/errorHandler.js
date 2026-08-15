// middleware/errorHandler.js

// Handles CastError (invalid MongoDB ObjectId)
function handleCastError(err) {
  return { status: 400, message: `Invalid ID: ${err.value}` };
}

// Handles duplicate key (e.g. duplicate email)
function handleDuplicateKey(err) {
  const field = Object.keys(err.keyValue)[0];
  return { status: 409, message: `${field} already exists` };
}

// Handles Mongoose validation errors
function handleValidationError(err) {
  const messages = Object.values(err.errors).map((e) => e.message);
  return { status: 400, message: messages.join('. ') };
}

export default function errorHandler(err, req, res, _next) {
  let status  = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError')          ({ status, message } = handleCastError(err));
  if (err.code === 11000)                ({ status, message } = handleDuplicateKey(err));
  if (err.name === 'ValidationError')    ({ status, message } = handleValidationError(err));

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${status}] ${message}`, err.stack);
  }

  res.status(status).json({ message });
}
