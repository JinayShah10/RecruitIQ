import express, { Request, Response } from 'express';
import cors from 'cors';
import { notFoundHandler } from './middleware/not-found-handler';
import { errorHandler } from './middleware/error-handler';

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'RecruitIQ API is running',
  });
});

// 404 Handler for Undefined Routes
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
