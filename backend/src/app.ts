import express, { Request, Response } from 'express';
import cors from 'cors';

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

export default app;
