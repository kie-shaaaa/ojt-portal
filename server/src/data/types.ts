export type AccountRegister = {
  email: string;
  password: string;
};

export type ApplicationStatus =
  | 'pending'
  | 'under_review'
  | 'rejected'
  | 'for_interview'
  | 'accepted';

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
  ojt_resume_path: string | null;
  deployment_date: string | null;

  // Job Fields
  position_applied: string | null;
  years_experience: number | null;
  current_company: string | null;
  job_resume_path: string | null;
  cover_letter_path: string | null;
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

  // File Metadata
  ojt_resume_size: number | null;
  job_resume_size: number | null;
  cover_letter_size: number | null;

  ojt_resume_name: string | null;
  job_resume_name: string | null;
  cover_letter_name: string | null;
};

export type Account = {
  id?: number;
  email: string;
  account_type: string;
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

export type Response = {
  status: number;
  message: string;
  ok: boolean;
  error?: typeof Error;
  data?: any;
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
  ojt_resume_path: string | null;
  ojt_resume_name: string | null;
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
  role: AccountType;
};

export type DashboardData = {
  totalApplications: number;
};

export type ApplicationSettings = {
  state: 'open' | 'closed';
  openingDate: Date;
};
