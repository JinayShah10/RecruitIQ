import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dob: Date;
  gender?: string;
  location?: string;
  headline?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema: Schema = new Schema<ICandidate>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    headline: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Candidate =
  (mongoose.models.Candidate as mongoose.Model<ICandidate>) ||
  mongoose.model<ICandidate>('Candidate', CandidateSchema);

export default Candidate;
