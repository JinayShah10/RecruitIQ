import dotenv from 'dotenv';
// Load environment variables before importing other modules
dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 8000;

const startServer = async (): Promise<void> => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDatabase();

    // 2. Start Express server only after successful connection
    const server = app.listen(PORT, () => {
      /* eslint-disable no-console */
      console.log(`✓ Server running on PORT ${PORT}`);
      console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[INFO] Health check available at: http://localhost:${PORT}/health`);
      /* eslint-enable no-console */
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      /* eslint-disable no-console */
      console.error(`[FATAL] Server failed to start on port ${PORT}:`, error.message);
      /* eslint-enable no-console */
      process.exit(1);
    });
  } catch (error) {
    /* eslint-disable no-console */
    console.error(
      '[FATAL] Server startup sequence aborted:',
      error instanceof Error ? error.message : error
    );
    /* eslint-enable no-console */
    process.exit(1);
  }
};

startServer();
