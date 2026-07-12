import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  candidateId: mongoose.Types.ObjectId;
  resumeUrl: string;
  extractedText?: string;
  parsedData?: Record<string, unknown>;
  isPrimary?: boolean;
  uploadedAt: Date;
}

const ResumeSchema: Schema = new Schema<IResume>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'Candidate',
      required: [true, 'Candidate reference is required'],
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
      trim: true,
    },
    extractedText: {
      type: String,
      trim: true,
    },
    parsedData: {
      type: Schema.Types.Mixed,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Resume =
  (mongoose.models.Resume as mongoose.Model<IResume>) ||
  mongoose.model<IResume>('Resume', ResumeSchema);

export default Resume;
