export interface PersonalDetailsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OjtInformationData {
  school: string;
  course: string;
  hours: string;
  deploymentDate: string;
}

export interface DocumentUploadData {
  [key: string]: File | null;
}

export interface DataPrivacyData {
  agreed: boolean;
}
