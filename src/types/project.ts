export type ProjectStatus = 'discovery' | 'halfway' | 'before-launch' | 'launched';

export interface Project {
  id: string;
  clientName: string;
  projectName: string;
  projectDetails: string;
  status: ProjectStatus;
  paymentAmount: number;
  paymentDueDate: string; // Using string for simplicity, can be Date object
  paymentStatus: 'pending' | 'paid' | 'overdue';
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  discovery: 'Discovery Phase',
  halfway: 'Halfway Phase',
  'before-launch': 'Before Launch Phase',
  launched: 'Launched',
};