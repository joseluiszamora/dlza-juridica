export interface FileMetadata {
  id?: string;
  title: string;
  description?: string;
  originalFilename: string;
  filename: string;
  path: string;
  size: number;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type AcceptedFileType = 
  | 'image/jpeg' 
  | 'image/png' 
  | 'image/gif' 
  | 'image/webp'
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/msword'
  | 'application/vnd.ms-excel';

export interface UploadResponseSuccess {
  message: string;
  file: FileMetadata;
}

export interface UploadResponseError {
  error: string;
}

export type UploadResponse = UploadResponseSuccess | UploadResponseError;