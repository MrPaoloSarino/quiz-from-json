import React, { useState, useEffect } from 'react';
import { projectManager } from '@/utils/projectManager';
import { StudyProject } from '@/types/project';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FolderKanban, Check, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ActiveProjectSelectorProps {
  onCreateProject?: () => void;
  onViewProjects?: () => void;
}

const ActiveProjectSelector: React.FC<ActiveProjectSelectorProps> = ({
  onCreateProject,
  onViewProjects,
}) => {
  const [activeProject, setActiveProject] = useState<StudyProject | null>(null);
  const [allProjects, setAllProjects] = useState<StudyProject[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const active = projectManager.getActiveProject();
    const all = projectManager.getAllProjects().filter(p => !p.isArchived);
    setActiveProject(active);
    setAllProjects(all);
  };

  const handleSelectProject = (projectId: string) => {
    projectManager.setActiveProject(projectId);
    const project = projectManager.getProject(projectId);
    setActiveProject(project);
    setIsOpen(false);
    toast.success(`Active project: ${project?.name}`);
  };

  const handleClearActive = () => {
    localStorage.removeItem('cerebrum_active_project');
    setActiveProject(null);
    setIsOpen(false);
    toast.info('No active project');
  };

  const getDaysRemaining = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={activeProject ? 'default' : 'outline'}
          size="sm"
          className="flex items-center gap-2"
        >
          <FolderKanban className="w-4 h-4" />
          <span className="hidden sm:inline">
            {activeProject ? activeProject.name : 'No Active Project'}
          </span>
          <span className="sm:hidden">
            {activeProject ? 'Project' : 'No Project'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Active Project</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {allProjects.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <p className="mb-3">No projects yet</p>
            <Button
              size="sm"
              onClick={() => {
                setIsOpen(false);
                onCreateProject?.();
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Project
            </Button>
          </div>
        ) : (
          <>
            {allProjects.map((project) => {
              const isActive = activeProject?.id === project.id;
              const daysRemaining = getDaysRemaining(project.targetDate);
              const stats = projectManager.getProjectStats(project.id);

              return (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleSelectProject(project.id)}
                  className="flex items-start gap-3 p-3 cursor-pointer"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isActive ? (
                      <Check className="w-4 h-4 text-primary" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {project.name}
                      </p>
                      {isActive && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{daysRemaining}d left</span>
                      <span>•</span>
                      <span>{project.overallProgress}%</span>
                      {stats && !stats.onTrack && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600">Behind</span>
                        </>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            {activeProject && (
              <DropdownMenuItem
                onClick={handleClearActive}
                className="text-muted-foreground"
              >
                Clear Active Project
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                onViewProjects?.();
              }}
            >
              <FolderKanban className="w-4 h-4 mr-2" />
              View All Projects
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
                onCreateProject?.();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActiveProjectSelector;
