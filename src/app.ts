import express, { Application, ErrorRequestHandler } from 'express';
import healthRouter from './routes/health';
import { tasksRouter } from './routes/tasks';

interface JsonParseError extends SyntaxError {
  status?: number;
  type?: string;
}

const isMalformedJsonError = (error: unknown): error is JsonParseError => {
  return (
    error instanceof SyntaxError &&
    typeof error === 'object' &&
    error !== null &&
    'body' in error
  );
};

const malformedJsonErrorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  next,
): void => {
  if (isMalformedJsonError(error)) {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  next(error);
};

const genericErrorHandler: ErrorRequestHandler = (_error, _req, res, _next): void => {
  res.status(500).json({ error: 'Internal server error' });
};

const app: Application = express();

app.use(express.json());
app.use(malformedJsonErrorHandler);

// Routes
app.use('/health', healthRouter);
app.use('/tasks', tasksRouter);
app.use(genericErrorHandler);

export default app;
