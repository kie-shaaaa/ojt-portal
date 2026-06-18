import { FastifyRequest } from 'fastify';

export type AccountRegister = {
  email: string;
  password: string;
  ipAddress?: string;
  rememberMe?: boolean;
};

export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'rejected'
  | 'for_interview'
  | 'accepted'
  | 'pending accept';

export type Application = {
  id: number;

  // Application Details
  application_type: string;
  other_application_type?: string | null;

  // Personal Info
  first_name: string;
  last_name: string;
  email: string;
  phone: string;

  // OJT Fields
  school_name: string | null;
  hours_needed: number | null;
  course: string | null;
  deployment_date: string | null;

  // Job Fields
  position_applied: string | null;
  years_experience: number | null;
  current_company: string | null;
  salary_expectation: number | null;
  available_date: string | null;

  // Agreement
  agreed_terms: boolean;

  // System Fields
  submission_date: string;

  status: ApplicationStatus;

  admin_notes: string | null;
  reviewed_by: number | null;
  reviewed_date: string | null;
};

export type Account = {
  id?: number;
  email: string;
  username: string;
  account_type: AccountType;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export type AccountCreate = {
  id?: string;
  email: string;
  username: string;
  password: string;
  account_type: string;
};

export type SuccessResponse = {
  status: string;
  ok: boolean;
  message: string;
  data: any;
};

// Submit application response
export type SubmitApplicationResponse = {
  ok: true;
  message: string;
  data: Application;
};

// Get applications response (returns array or null on success)
export type GetApplicationsResponse = Application[] | null;

// Get single application response (returns array on success)
export type GetApplicationResponse = Application[];

// Get application for status/update response (returns single application or null)
export type GetApplicationStatusResponse = Application | null;

export type SignInResponse = {
  token: string;
  user: Omit<Account, 'password'>;
};

export type RegisterResponse = {
  token: string;
  user: Account;
  message: string;
};

export type ChangePasswordResponse = {
  message: string;
};

export type FindAccount = {
  email: string;
};

export type AllOjt = {
  id: number;
  ojt_id: string;
  application_id: number;
  application_type: string;
  first_name: string;
  last_name: string;
  gender: 'Male' | 'Female' | null;
  email: string;
  phone: string;
  school_name: string | null;
  hours_needed: number | null;
  course: string | null;
  deployment_date: string | null;
  end_date: string | null;
  certificate_issuance_date: string | null;
  orientation_date: string | null;
  confirmed_at: string | null;
  confirmation_ip: string | null;
  second_chance: number;
  submission_date: string;
  original_status: string | null;
  moved_to_ojt_at: string;
  admin_notes: string | null;
};

export type AccountType = 'admin' | 'employee';
export type Token = {
  sub: number;
  email: string;
  account_type: AccountType | 'user';
};

export type DashboardData = {
  totalApplications: number;
  pendingApplications: number;
  underReviewApplications: number;
  forInterviewApplications: number;
  rejectedApplications: number;
  acceptedApplications: number;
  dailyApplications: DashboardSeriesPoint[];
  monthlyApplications: DashboardSeriesPoint[];
  statusDistribution: DashboardSeriesPoint[];
};

export type DashboardSeriesPoint = {
  label: string;
  value: number;
};

export type ApplicationSettings = {
  state: 'open' | 'closed';
  openingDate?: Date;
};

export type AccountPagination = {
  count?: number;
  type?: AccountType;
  createdDate?: Date;
};

export type Schools = {
  id: number;
  schoolName: string;
};

export type Courses = {
  id: number;
  courseName: string;
};

export type UpdateApplicationSettingsDto = {
  portal_status: boolean;
  opening_date?: Date;
  closing_date?: Date;
  created_by: number;
};

export type AppointmentType = 'interview' | 'orientation';

export type ResponseStatus = 'scheduled' | 'rejected' | 'orientation';

export type LogSignIn = {
  userId?: number;
  success: boolean;
  ipAddress?: string;
};

export type LogChangePassword = {
  userId?: number;
  details: string;
  ipAddress?: string;
};

// Log action types based on database enum `log_action`
export type LogAction =
  | 'User Created'
  | 'User Updated'
  | 'User Deleted'
  | 'Logged In'
  | 'User Status Update'
  | 'Application Reviewed'
  | 'Application Status Change'
  | 'Admin Notes Added'
  | 'Account Locked'
  | 'Account Unlocked'
  | 'Password Reset'
  | 'Settings Updated'
  | 'File Uploaded'
  | 'File Deleted'
  | 'other';

export type BaseLog = {
  userId?: number;
  ipAddress?: string;
  details?: string;
};

export type LogUserCreated = BaseLog;
export type LogUserUpdated = BaseLog & { changes?: string };
export type LogUserDeleted = BaseLog;
export type LogUserStatusUpdate = BaseLog & {
  oldStatus?: string;
  newStatus?: string;
};
export type LogApplicationReviewed = BaseLog & {
  applicationId?: number;
  reviewedBy?: number;
  notes?: string;
};
export type LogApplicationStatusChange = BaseLog & {
  applicationId?: number;
  oldStatus?: string;
  newStatus?: string;
};
export type LogAdminNotesAdded = BaseLog & { notes?: string };
export type LogAccountLock = BaseLog & { reason?: string };
export type LogAccountUnlock = BaseLog & {};
export type LogPasswordReset = BaseLog & { method?: string };
export type LogSettingsUpdated = BaseLog & {
  key?: string;
  oldValue?: string;
  newValue?: string;
};
export type LogFileUploaded = BaseLog & {
  filename?: string;
  path?: string;
  size?: number;
};
export type LogFileDeleted = BaseLog & { filename?: string; path?: string };
export type LogOther = BaseLog & { action?: string };

export type Logs = {
  id: number;
  user_id: number | null;
  action: string;
  details: string;
  ip_address: string;
  created_at: Date;
};

export type FetchAllLogs = Logs[] | null;

// Promise/Response types for controllers
export type ApiPromise<T> = Promise<T>;
export type ControllerResponse<T> = ApiPromise<T>;
export type VoidResponse = ApiPromise<void>;
export type SuccessApiResponse<T = any> = ApiPromise<{
  status: string;
  ok: boolean;
  message: string;
  data: T;
}>;
export type DataResponse<T> = ApiPromise<T | null>;
export type ListResponse<T> = ApiPromise<T[] | null>;

export type AuthenticatedUser = {
  userId: number;
  email: string;
  account_type: 'admin' | 'employee' | 'user';
};

export interface JwtUser {
  id: string;
  email?: string;
  [key: string]: unknown;
}

export interface FastifyRequestWithUser extends FastifyRequest {
  user?: JwtUser;
}
