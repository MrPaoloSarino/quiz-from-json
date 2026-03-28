import React, { useState, useEffect } from 'react';
import { StudyProject, ProjectStats, SubjectProgress } from '@/types/project';
import { projectManager } from '@/utils/projectManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  CheckCircle2,
  Circle,
  Edit,
  Archive,
  Share2,
  Play,
  BookOpen,
  Flame,
} from 'lucide-react';

interface ProjectOverviewProps {
  projectId?: string;
  onStartQuiz?: (subjectId: string) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ projectId, onStartQuiz }) => {
  const [project, setProject] = useState<StudyProject | null>(null);
  const [stats, setStats] = useState<ProjectStats | null>(null);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = () => {
    const activeProject = projectId 
      ? projectManager.getProject(projectId)
      : projectManager.getActiveProject();
    
    if (activeProject) {
      setProject(activeProject);
      const projectStats = projectManager.getProjectStats(activeProject.id);
      setStats(projectStats);
    }
  };

  if (!project || !stats) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No active project found</p>
            <Button onClick={() => window.location.href = '/projects/new'}>
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-500';
      case 'advanced': return 'bg-blue-500';
      case 'intermediate': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getMasteryLabel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary" />
                <CardTitle className="text-3xl">{project.name}</CardTitle>
              </div>
              <p className="text-muted-foreground">{project.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Target: {formatDate(project.targetDate)}</span>
                </div>
                <Badge variant={stats.daysRemaining > 30 ? 'default' : 'destructive'}>
                  {stats.daysRemaining} days remaining
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="w-4 h-4 mr-1" />
                Archive
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-semibold">{project.overallProgress}%</span>
            </div>
            <Progress value={project.overallProgress} className="h-3" />
            {!stats.onTrack && (
              <p className="text-sm text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Behind schedule - increase daily practice to catch up
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
                <p className="text-3xl font-bold">{project.totalQuizzesTaken}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                <p className="text-3xl font-bold">{project.averageAccuracy.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Streak</p>
                <p className="text-3xl font-bold flex items-center gap-1">
                  {project.studyStreak}
                  <Flame className="w-6 h-6 text-orange-500" />
                </p>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours Logged</p>
                <p className="text-3xl font-bold">{(project.totalStudyTime / 60).toFixed(1)}h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Consistency Tracker */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Weekly Consistency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.weeklyProgress.slice(-4).map((week, idx) => {
              const completedDays = week.daysCompleted.filter(Boolean).length;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              
              return (
                <div key={week.weekNumber} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Week {week.weekNumber + 1}</span>
                    <span className="text-muted-foreground">
                      {completedDays}/7 days • {week.totalMinutes} min
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {days.map((day, dayIdx) => (
                      <div
                        key={day}
                        className={`flex-1 h-12 rounded flex flex-col items-center justify-center text-xs ${
                          week.daysCompleted[dayIdx]
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <span className="font-medium">{day}</span>
                        {week.daysCompleted[dayIdx] && (
                          <CheckCircle2 className="w-4 h-4 mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Daily Goal: {project.weeklyGoal} minutes minimum
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.subjects.map((subject) => (
              <div key={subject.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getMasteryColor(subject.masteryLevel)}>
                        {getMasteryLabel(subject.masteryLevel)}
                      </Badge>
                      {subject.needsAttention && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Needs Attention
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Progress: {subject.progress}%</p>
                    <p>Avg: {subject.averageAccuracy.toFixed(1)}%</p>
                  </div>
                </div>

                <Progress value={subject.progress} className="h-2" />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Quizzes: {subject.quizzesTaken} | Hard Mode: {subject.hardModeQuizzes} | 
                    Time: {(subject.timeSpent / 60).toFixed(1)}h
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => onStartQuiz?.(subject.id)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Practice
                  </Button>
                  <Button size="sm" variant="outline">
                    Review Weak Areas
                  </Button>
                  <Button size="sm" variant="outline">
                    Take Hard Quiz
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Master Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Master Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {project.masterChecklist.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5">
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                  {item.progress !== undefined && (
                    <Progress value={item.progress} className="h-1.5 mt-2" />
                  )}
                </div>
                <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                  {item.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">This Week's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.weeklyTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  task.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                  <div>
                    <p className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                      {task.day}: {task.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Target: {task.targetQuestions} questions
                      {task.completed && task.actualAccuracy && (
                        <span className="ml-2 text-green-600">
                          • Done: {task.actualAccuracy.toFixed(0)}%
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
