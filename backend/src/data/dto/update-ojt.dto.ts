export type UpdateOjtDto = {
  id: number;
  firstName?: string;
  lastName?: string;
  school?: string;
  course?: string;
  ojtYear?: string;
  adminNote?: string;
  gender?: 'Male' | 'Female' | 'Not Set' | 'Non-binary';
  deploymentDate?: string;
  endDate?: string;
};
