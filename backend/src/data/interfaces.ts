import { ApplicationStatus, ResponseStatus } from './types';

export interface DeletionEmailDto {
  to: string;
  firstName: string;
  lastName: string;
  applicationId: number;
  applicationType?: string;
}

export interface ConfirmationEmailDto {
  to: string;
  firstName: string;
  lastName: string;
  applicationId: number;
  applicationType: string;
  submittedAt?: Date;
}

export interface AcceptanceConfirmationEmailDto {
  to: string;
  firstName: string;
  lastName: string;
  applicationId: number;
  orientationDate?: string;
  orientationTime?: string;
  confirmUrl: string;
  rejectUrl?: string;
}

export interface ResponseEmailDto {
  to: string;
  firstName: string;
  lastName: string;
  applicationId: number;
  status: ResponseStatus;
  interviewDate?: string;
  interviewTime?: string;
  acceptedDate?: string;
  acceptedTime?: string;
  interviewLocation?: string;
  adminNote?: string;
  confirmUrl?: string;
  rescheduleUrl?: string;
}

export interface StatusUpdateEmailDto {
  to: string;
  firstName: string;
  lastName: string;
  applicationId: number;
  status: ApplicationStatus;
  adminNote?: string;
}

export interface ResubmissionEmailDto {
  to: string;
  firstName: string;
  lastName: string;
  applicationId: number;
  requiredFiles: string[];
  rejectionReason?: string;
}

export interface ContactMessageDto {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface UpdateApplicationDto {
  id: number;
  status: ApplicationStatus;
  interviewDate?: string;
  interviewTime?: string;
  acceptedDate?: string;
  acceptedTime?: string;
  interviewLocation?: string;
  adminNote?: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
  account_type: 'admin' | 'employee' | 'user';
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  account_type: 'admin' | 'employee' | 'user';
}

export interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}
