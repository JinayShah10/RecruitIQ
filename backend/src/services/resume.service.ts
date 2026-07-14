import { supabase } from '../utils/supabase';
import Resume, { IResume } from '../models/Resume';
import { AppError } from '../utils/app-error';

export class ResumeService {
  /**
   * Upload resume to Supabase Storage and persist metadata in MongoDB
   * @param candidateId ID of the uploading candidate
   * @param file Express.Multer.File object containing file buffer and meta
   */
  public static async uploadResume(
    candidateId: string,
    file: Express.Multer.File
  ): Promise<IResume> {
    const bucketName = process.env.SUPABASE_BUCKET || 'resumes';

    // Sanitize file name to avoid path/special character issues
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `candidate_${candidateId}_${Date.now()}_${sanitizedOriginalName}`;

    // Upload to Supabase Storage bucket
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new AppError(`Supabase Storage upload failed: ${error.message}`, 500);
    }

    // Generate public URL reference
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      throw new AppError('Failed to generate public URL reference from Supabase Storage', 500);
    }

    const publicUrl = publicUrlData.publicUrl;

    // Persist document to MongoDB Resume collection
    const resume = new Resume({
      candidateId,
      resumeUrl: publicUrl,
      extractedText: '', // Placeholder for future AI parsing phases
      parsedData: {},    // Placeholder for future AI parsing phases
      isPrimary: false,
    });

    await resume.save();

    return resume;
  }
}
