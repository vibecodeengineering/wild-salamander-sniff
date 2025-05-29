import { useState, useMemo } from 'react';
import { Project, ProjectStatus, PROJECT_STATUS_LABELS } from '@/types/project';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectFilters } from '@/components/ProjectFilters';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { AddEditProjectDialog, ProjectFormData } from '@/components/AddEditProjectDialog'; // Import the dialog

// Sample Data
const initialProjects: Project[] = [
  {
    id: '1',
    clientName: 'Tech Solutions Inc.',
    projectName: 'Website Redesign',
    projectDetails: 'Complete overhaul of the existing corporate website with new branding and e-commerce functionality.',
    status: 'discovery',
    paymentAmount: 1500,
    paymentDueDate: '2024-08-15',
    paymentStatus: 'pending',
  },
  {
    id: '2',
    clientName: 'GreenLeaf Organics',
    projectName: 'Mobile App Development',
    projectDetails: 'Develop a cross-platform mobile application for online ordering and delivery tracking.',
    status: 'halfway',
    paymentAmount: 3500,
    paymentDueDate: '2024-07-30',
    paymentStatus: 'paid',
  },
  {
    id: '3',
    clientName: 'Innovate Hub',
    projectName: 'CRM Integration',
    projectDetails: 'Integrate a new CRM system with existing sales and marketing tools.',
    status: 'before-launch',
    paymentAmount: 2000,
    paymentDueDate: '2024-09-01',
    paymentStatus: 'pending',
  },
  {
    id: '4',
    clientName: 'Global Exports Ltd.',
    projectName: 'Logistics Platform',
    projectDetails: 'Build a comprehensive logistics management platform for international shipping.',
    status: 'launched',
    paymentAmount: 5000,
    paymentDueDate: '2024-06-01',
    paymentStatus: 'paid',
  },
];

const projectPhases: ProjectStatus[] = ['discovery', 'halfway', 'before-launch', 'launched'];
const phasePaymentAmounts: Record<ProjectStatus, number> = {
  discovery: 1500,
  halfway: 3500,
  'before-launch': 2000,
  launched: 0, // Typically no new payment when launched, or it's the final milestone payment
};


const Index = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    if (filter === 'all') {
      return projects;
    }
    return projects.filter((project) => project.status === filter);
  }, [projects, filter]);

  const handleUpdatePaymentStatus = (projectId: string, paymentStatus: 'paid' | 'pending') => {
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId ? { ...p, paymentStatus } : p
      )
    );
    console.log(`Updated payment status for project ${projectId} to ${paymentStatus}`);
  };

  const handleAdvancePhase = (projectId: string) => {
    setProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          const currentPhaseIndex = projectPhases.indexOf(p.status);
          if (currentPhaseIndex < projectPhases.length - 1) {
            const nextPhase = projectPhases[currentPhaseIndex + 1];
            return {
              ...p,
              status: nextPhase,
              paymentStatus: 'pending', 
              paymentAmount: phasePaymentAmounts[nextPhase] || p.paymentAmount, // Use phase specific amount or keep current
              paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // e.g. 30 days from now
            };
          }
        }
        return p;
      })
    );
    console.log(`Advanced phase for project ${projectId}`);
  };
  
  const handleSaveProject = (data: ProjectFormData, projectId?: string) => {
    if (projectId) { // Editing existing project
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId
            ? { ...p, ...data, paymentAmount: Number(data.paymentAmount) } // Ensure paymentAmount is number
            : p
        )
      );
      console.log(`Edited project ${projectId}`);
    } else { // Adding new project
      const newProject: Project = {
        ...data,
        id: String(Date.now()), // Simple ID generation
        paymentStatus: 'pending', // New projects start as pending
        paymentAmount: Number(data.paymentAmount), // Ensure paymentAmount is number
      };
      setProjects(prevProjects => [newProject, ...prevProjects]);
      console.log(`Added new project: ${newProject.projectName}`);
    }
    setIsProjectDialogOpen(false);
    setProjectToEdit(null);
  };

  const openAddProjectDialog = () => {
    setProjectToEdit(null);
    setIsProjectDialogOpen(true);
  };

  const openEditProjectDialog = (project: Project) => {
    setProjectToEdit(project);
    setIsProjectDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Client Project Tracker</h1>
          <Button onClick={openAddProjectDialog} variant="default">
            <PlusCircle size={18} className="mr-2" />
            Add Project
          </Button>
        </div>
      </header>

      <ProjectFilters currentFilter={filter} onFilterChange={setFilter} />

      <main className="container mx-auto p-4">
        <AddEditProjectDialog
          isOpen={isProjectDialogOpen}
          onClose={() => {
            setIsProjectDialogOpen(false);
            setProjectToEdit(null);
          }}
          onSaveProject={handleSaveProject}
          projectToEdit={projectToEdit}
        />
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onUpdatePaymentStatus={handleUpdatePaymentStatus}
                onAdvancePhase={handleAdvancePhase}
                onEditProject={openEditProjectDialog} // Pass the edit handler
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-muted-foreground">No projects found.</h2>
            <p className="text-muted-foreground">
              Try adjusting your filters or add a new project.
            </p>
          </div>
        )}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;