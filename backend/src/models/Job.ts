import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  recruiterId: mongoose.Types.ObjectId;
  title: string;
  department?: string;
  employmentType?: string;
  location?: string;
  salaryRange?: string;
  experienceRequired?: string;
  skillsRequired?: string[];
  description?: string;
  aiGeneratedJD?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema<IJob>(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'Recruiter',
      required: [true, 'Recruiter reference is required'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    salaryRange: {
      type: String,
      trim: true,
    },
    experienceRequired: {
      type: String,
      trim: true,
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    aiGeneratedJD: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job =
  (mongoose.models.Job as mongoose.Model<IJob>) ||
  mongoose.model<IJob>('Job', JobSchema);

export default Job;
