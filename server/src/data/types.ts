export type AccountRegister = {
  email: string;
  password: string;
};

enum applicationStatus {
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
  INTERVIEW = 'INTERVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export type Application = {
  applicationId?: number;
  firstname: string;
  lastname: string;
  email: string;
  contactNumber: string;
  course: string;
  school: string;
  hours: number;
  deploymentDate: Date;
  resume: boolean;
  draftMoa: boolean;
  proofOfEnrollment: boolean;
  draftEndorsement: boolean;
  vaccineCard: boolean;
  picture: boolean;
  status: applicationStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Account = {
  id?: number;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

export type AccountCreate = {
  email: string;
  username: string;
  password: string;
  account_type: string;
};

export type Response = {
  status: number;
  message: string;
  ok: boolean;
  error?: [];
  data?: any;
};

export type FindAccount = {
  email: string;
};
