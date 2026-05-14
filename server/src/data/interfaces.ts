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
}

export interface StatusUpdateEmailDto {
  to: string;
  firstName: string;
  lastName: string;
  applicationId: number;
  status: ApplicationStatus;
  adminNote?: string;
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
