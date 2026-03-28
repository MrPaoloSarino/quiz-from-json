import React, { useState, useEffect } from 'react';
import { StudyProject } from '@/types/project';
import { projectManager } from '@/utils/projectManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Calendar,
  TrendingUp,
  Clock,
  Archive,
  Trash2,
  Eye,
  AlertCircle,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface ProjectsListProps {
  onCreateProject?: () => void;
  onViewProject?: (projectId: string) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ onCreateProject, onViewProject }) => {
  const [projects, setProjects] = useState<StudyProject[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, [showArchived]);

  const loadProjects = () => {
    const allProjects = projectManager.getAllProjects();
    const filtered = showArchived 
      ? allProjects.filter(p => p.isArchived)
      : allProjects.filter(p => !p.isArchived);
    
    // Sort by target date (closest first)
    filtered.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
    setProjects(filtered);
  };

  const handleArchiveToggle = (projectId: string) => {
    projectManager.toggleArchive(projectId);
    loadProjects();
    toast.success(showArchived ? 'Project unarchived' : 'Project archived');
  };

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      projectManager.deleteProject(projectToDelete);
      loadProjects();
      toast.success('Project deleted');
      setProjectToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const getDaysRemaining = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (project: StudyProject) => {
    const daysRemaining = getDaysRemaining(project.targetDate);
    
    if (daysRemaining < 0) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    if (daysRemaining <= 7) {
      return <Badge variant="destructive">Due Soon</Badge>;
    }
    
    if (daysRemaining <= 30) {
      return <Badge className="bg-amber-500">1 Month Left</Badge>;
    }
    
    return <Badge variant="secondary">{daysRemaining} days</Badge>;
  };

  if (projects.length === 0 && !showArchived) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first study project to start tracking your exam preparation
              </p>
            </div>
            <Button onClick={onCreateProject} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Projects</h1>
          <p className="text-muted-foreground">
            Manage your exam preparation projects
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="w-4 h-4 mr-2" />
            {showArchived ? 'Show Active' : 'Show Archived'}
          </Button>
          <Button onClick={onCreateProject}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              {showArchived ? 'No archived projects' : 'No active projects'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const daysRemaining = getDaysRemaining(project.targetDate);
            const stats = projectManager.getProjectStats(project.id);
            
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl line-clamp-2">
                      {project.name}
                    </CardTitle>
                    {getStatusBadge(project)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{project.overallProgress}%</span>
                    </div>
                    <Progress value={project.overallProgress} className="h-2" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {formatDate(project.targetDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {project.averageAccuracy.toFixed(0)}% avg
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {(project.totalStudyTime / 60).toFixed(1)}h
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {project.totalQuizzesTaken} quizzes
                      </span>
                    </div>
                  </div>

                  {/* Warning if behind schedule */}
                  {stats && !stats.onTrack && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                      <AlertCircle className="w-4 h-4" />
                      <span>Behind schedule</span>
                    </div>
                  )}

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1">
                    {project.subjects.slice(0, 3).map((subject) => (
                      <Badge key={subject.id} variant="outline" className="text-xs">
                        {subject.name}
                      </Badge>
                    ))}
                    {project.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => onViewProject?.(project.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleArchiveToggle(project.id)}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All project data including progress,
              statistics, and checklists will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsList;
