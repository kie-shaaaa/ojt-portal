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
  account_type: AccountType;
};

export type DashboardData = {
  totalApplications: number;
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
  status: boolean;
  opening_date?: Date;
};
