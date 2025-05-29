import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project, ProjectStatus, PROJECT_STATUS_LABELS } from "@/types/project";
import { useEffect } from "react";

const projectFormSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  projectName: z.string().min(1, "Project name is required"),
  projectDetails: z.string().min(1, "Project details are required"),
  status: z.enum(['discovery', 'halfway', 'before-launch', 'launched']),
  paymentAmount: z.coerce.number().positive("Payment amount must be positive"),
  paymentDueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format for due date.",
  }).refine(val => new Date(val) >= new Date(new Date().setHours(0,0,0,0)), { // Ensure date is not in the past
    message: "Due date cannot be in the past."
  }),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

interface AddEditProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (data: ProjectFormData, projectId?: string) => void;
  projectToEdit?: Project | null;
}

const availableStatuses: ProjectStatus[] = ['discovery', 'halfway', 'before-launch', 'launched'];

export const AddEditProjectDialog: React.FC<AddEditProjectDialogProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  projectToEdit,
}) => {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      clientName: "",
      projectName: "",
      projectDetails: "",
      status: "discovery",
      paymentAmount: 0,
      paymentDueDate: new Date().toISOString().split('T')[0], // Default to today
    },
  });

  useEffect(() => {
    if (projectToEdit) {
      form.reset({
        clientName: projectToEdit.clientName,
        projectName: projectToEdit.projectName,
        projectDetails: projectToEdit.projectDetails,
        status: projectToEdit.status,
        paymentAmount: projectToEdit.paymentAmount,
        paymentDueDate: projectToEdit.paymentDueDate ? new Date(projectToEdit.paymentDueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      form.reset({ // Default values for new project
        clientName: "",
        projectName: "",
        projectDetails: "",
        status: "discovery",
        paymentAmount: 1000, // Example default
        paymentDueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // Default to one week from today
      });
    }
  }, [projectToEdit, form, isOpen]); // Rerun effect if isOpen changes to reset form when dialog opens

  const onSubmit = (data: ProjectFormData) => {
    onSaveProject(data, projectToEdit?.id);
    onClose(); // Close dialog after saving
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{projectToEdit ? "Edit Project" : "Add New Project"}</DialogTitle>
          <DialogDescription>
            {projectToEdit ? "Update the details of your project." : "Fill in the details for the new project."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., E-commerce Platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the project scope and deliverables." className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableStatuses.map(status => (
                        <SelectItem key={status} value={status}>
                          {PROJECT_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentDueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{projectToEdit ? "Save Changes" : "Add Project"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};