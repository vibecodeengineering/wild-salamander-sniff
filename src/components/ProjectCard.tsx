import { Project, PROJECT_STATUS_LABELS } from '@/types/project';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, CalendarDays, Info } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onUpdatePaymentStatus: (projectId: string, status: 'paid' | 'pending') => void;
  onAdvancePhase: (projectId: string) => void;
}

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'discovery': return 'bg-blue-500 hover:bg-blue-600';
    case 'halfway': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'before-launch': return 'bg-orange-500 hover:bg-orange-600';
    case 'launched': return 'bg-green-500 hover:bg-green-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

const getPaymentStatusColor = (status: Project['paymentStatus']) => {
  switch (status) {
    case 'paid': return 'bg-green-500 hover:bg-green-600';
    case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
    case 'overdue': return 'bg-red-500 hover:bg-red-600';
    default: return 'bg-gray-500 hover:bg-gray-600';
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onUpdatePaymentStatus, onAdvancePhase }) => {
  return (
    <Card className="w-full max-w-sm flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl">{project.projectName}</CardTitle>
        <CardDescription>{project.clientName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center space-x-2">
          <Info size={16} className="text-muted-foreground" />
          <Badge variant="outline" className={`${getStatusColor(project.status)} text-white`}>
            {PROJECT_STATUS_LABELS[project.status]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">{project.projectDetails}</p>
        <div className="space-y-2 pt-2">
          <div className="flex items-center text-sm">
            <DollarSign size={16} className="mr-2 text-green-500" />
            <span>Payment: ${project.paymentAmount.toFixed(2)}</span>
            <Badge variant="secondary" className={`ml-2 ${getPaymentStatusColor(project.paymentStatus)} text-white`}>
              {project.paymentStatus.charAt(0).toUpperCase() + project.paymentStatus.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center text-sm">
            <CalendarDays size={16} className="mr-2 text-blue-500" />
            <span>Due: {project.paymentDueDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
        {project.paymentStatus === 'pending' && (
          <Button onClick={() => onUpdatePaymentStatus(project.id, 'paid')} size="sm" variant="outline" className="w-full sm:w-auto">
            Mark as Paid
          </Button>
        )}
        {project.paymentStatus === 'paid' && project.status !== 'launched' && (
          <Button onClick={() => onAdvancePhase(project.id)} size="sm" className="w-full sm:w-auto">
            Advance Phase
          </Button>
        )}
         {project.paymentStatus === 'paid' && project.status === 'launched' && (
          <Badge variant="default" className="bg-green-600 text-white w-full sm:w-auto justify-center">Project Completed</Badge>
        )}
      </CardFooter>
    </Card>
  );
};