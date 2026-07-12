import mongoose, { Schema, Document } from 'mongoose';

export interface IAIAnalysis extends Document {
  applicationId: mongoose.Types.ObjectId;
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  recommendation: string;
  summary: string;
  llmModel: string;
  promptVersion: string;
  matchingSkills?: string[];
  missingSkills?: string[];
  strengths?: string[];
  weaknesses?: string[];
  createdAt: Date;
}

const AIAnalysisSchema: Schema = new Schema<IAIAnalysis>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required'],
    },
    overallScore: {
      type: Number,
      required: [true, 'Overall score is required'],
    },
    skillScore: {
      type: Number,
      required: [true, 'Skill score is required'],
    },
    experienceScore: {
      type: Number,
      required: [true, 'Experience score is required'],
    },
    educationScore: {
      type: Number,
      required: [true, 'Education score is required'],
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      trim: true,
    },
    summary: {
      type: String,
      required: [true, 'Summary is required'],
      trim: true,
    },
    llmModel: {
      type: String,
      required: [true, 'LLM Model is required'],
      trim: true,
    },
    promptVersion: {
      type: String,
      required: [true, 'Prompt version is required'],
      trim: true,
    },
    matchingSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    missingSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    strengths: [
      {
        type: String,
        trim: true,
      },
    ],
    weaknesses: [
      {
        type: String,
        trim: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const AIAnalysis =
  (mongoose.models.AIAnalysis as mongoose.Model<IAIAnalysis>) ||
  mongoose.model<IAIAnalysis>('AIAnalysis', AIAnalysisSchema);

export default AIAnalysis;
