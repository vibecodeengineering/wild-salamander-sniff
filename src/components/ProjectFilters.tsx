import { ProjectStatus, PROJECT_STATUS_LABELS } from '@/types/project';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  currentFilter: ProjectStatus | 'all';
  onFilterChange: (filter: ProjectStatus | 'all') => void;
}

const availableStatuses: ProjectStatus[] = ['discovery', 'halfway', 'before-launch', 'launched'];

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-card border-b">
      <Button
        variant={currentFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onFilterChange('all')}
        className={cn("capitalize", currentFilter === 'all' && "bg-primary text-primary-foreground")}
      >
        All Projects
      </Button>
      {availableStatuses.map((status) => (
        <Button
          key={status}
          variant={currentFilter === status ? 'default' : 'outline'}
          onClick={() => onFilterChange(status)}
          className={cn("capitalize", currentFilter === status && "bg-primary text-primary-foreground")}
        >
          {PROJECT_STATUS_LABELS[status]}
        </Button>
      ))}
    </div>
  );
};