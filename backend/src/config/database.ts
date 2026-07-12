import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  try {
    // Connect to MongoDB Atlas via Mongoose
    await mongoose.connect(uri);
    /* eslint-disable no-console */
    console.log('✓ MongoDB Atlas Connected');
    /* eslint-enable no-console */
  } catch (error) {
    /* eslint-disable no-console */
    console.error(
      'MongoDB Atlas connection failure:',
      error instanceof Error ? error.message : error
    );
    /* eslint-enable no-console */
    throw error;
  }
};
