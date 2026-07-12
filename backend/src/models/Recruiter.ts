import mongoose, { Schema, Document } from 'mongoose';

export interface IRecruiter extends Document {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  designation?: string;
  companyDescription?: string;
  companyLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RecruiterSchema: Schema = new Schema<IRecruiter>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
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
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recruiter =
  (mongoose.models.Recruiter as mongoose.Model<IRecruiter>) ||
  mongoose.model<IRecruiter>('Recruiter', RecruiterSchema);

export default Recruiter;
