export type UpdateOjtDto = {
  id: number;
  ojtYear?: string;
  adminNote?: string;
  gender?: 'Male' | 'Female' | 'Not Set';
  deploymentDate?: string;
  endDate?: string;
};
