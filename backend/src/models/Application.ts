import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  candidateId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  status: string;
  aiStatus: string;
  appliedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema<IApplication>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate reference is required'],
    },
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Resume reference is required'],
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Hired'],
      required: [true, 'Application status is required'],
      trim: true,
    },
    aiStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed'],
      required: [true, 'AI processing status is required'],
      trim: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Application =
  (mongoose.models.Application as mongoose.Model<IApplication>) ||
  mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;
