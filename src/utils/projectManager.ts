/**
 * Project Manager - Handles all project-based study management
 */

import {
  StudyProject,
  CreateProjectInput,
  UpdateProjectInput,
  SubjectProgress,
  WeeklyProgress,
  ChecklistItem,
  WeeklyTask,
  ProjectStats,
  WeakArea,
} from '@/types/project';

const STORAGE_KEY = 'cerebrum_study_projects';
const ACTIVE_PROJECT_KEY = 'cerebrum_active_project';

class ProjectManager {
  /**
   * Get all projects
   */
  getAllProjects(): StudyProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data, this.dateReviver);
    } catch (error) {
      console.error('Failed to load projects:', error);
      return [];
    }
  }

  /**
   * Get a single project by ID
   */
  getProject(id: string): StudyProject | null {
    const projects = this.getAllProjects();
    return projects.find(p => p.id === id) || null;
  }

  /**
   * Get active project
   */
  getActiveProject(): StudyProject | null {
    const activeId = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (!activeId) return null;
    return this.getProject(activeId);
  }

  /**
   * Set active project
   */
  setActiveProject(id: string): void {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }

  /**
   * Create a new project
   */
  createProject(input: CreateProjectInput): StudyProject {
    const now = new Date();
    const project: StudyProject = {
      id: this.generateId(),
      name: input.name,
      description: input.description,
      targetDate: input.targetDate,
      createdAt: now,
      updatedAt: now,
      
      overallProgress: 0,
      totalQuizzesTaken: 0,
      totalQuestionsAnswered: 0,
      averageAccuracy: 0,
      totalStudyTime: 0,
      
      studyStreak: 0,
      weeklyGoal: input.weeklyGoal || 30, // 30 minutes default
      weeklyProgress: [this.createWeeklyProgress(0)],
      
      subjects: (input.subjects || []).map(name => this.createSubject(name)),
      
      masterChecklist: this.createDefaultChecklist(input.subjects || []),
      weeklyTasks: this.createWeeklyTasks(),
      
      accuracyTrend: [],
      difficultyDistribution: {
        easy: { count: 0, averageAccuracy: 0 },
        medium: { count: 0, averageAccuracy: 0 },
        hard: { count: 0, averageAccuracy: 0 },
      },
      timeAnalytics: {
        averagePerQuestion: 0,
        fastestQuestion: 0,
        slowestQuestion: 0,
        totalSessions: 0,
        averageSessionLength: 0,
      },
      weakAreas: [],
      
      isArchived: false,
    };

    this.saveProject(project);
    this.setActiveProject(project.id);
    return project;
  }

  /**
   * Update a project
   */
  updateProject(id: string, updates: UpdateProjectInput): StudyProject | null {
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    this.saveAllProjects(projects);
    return projects[index];
  }

  /**
   * Delete a project
   */
  deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    
    if (filtered.length === projects.length) return false;
    
    this.saveAllProjects(filtered);
    
    // Clear active project if it was deleted
    if (localStorage.getItem(ACTIVE_PROJECT_KEY) === id) {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
    
    return true;
  }

  /**
   * Archive/unarchive a project
   */
  toggleArchive(id: string): StudyProject | null {
    const project = this.getProject(id);
    if (!project) return null;
    
    return this.updateProject(id, { isArchived: !project.isArchived });
  }

  /**
   * Record quiz completion for a project
   */
  recordQuizCompletion(
    projectId: string,
    subjectId: string,
    questionsCount: number,
    accuracy: number,
    timeSpent: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): void {
    const project = this.getProject(projectId);
    if (!project) return;

    // Update overall stats
    const totalQuestions = project.totalQuestionsAnswered + questionsCount;
    const newAverageAccuracy = 
      (project.averageAccuracy * project.totalQuestionsAnswered + accuracy * questionsCount) / totalQuestions;

    // Update subject progress
    const subjects = project.subjects.map(subject => {
      if (subject.id === subjectId) {
        const subjectTotal = subject.quizzesTaken * 10; // estimate
        const newSubjectAvg = 
          (subject.averageAccuracy * subjectTotal + accuracy * questionsCount) / (subjectTotal + questionsCount);
        
        return {
          ...subject,
          quizzesTaken: subject.quizzesTaken + 1,
          averageAccuracy: newSubjectAvg,
          timeSpent: subject.timeSpent + timeSpent,
          progress: Math.min(100, subject.progress + 2),
          lastPracticed: new Date(),
          hardModeQuizzes: difficulty === 'hard' ? subject.hardModeQuizzes + 1 : subject.hardModeQuizzes,
          masteryLevel: this.calculateMasteryLevel(newSubjectAvg, subject.quizzesTaken + 1),
          needsAttention: newSubjectAvg < 70,
        };
      }
      return subject;
    });

    // Update difficulty distribution
    const diffDist = { ...project.difficultyDistribution };
    const diffKey = difficulty;
    const currentCount = diffDist[diffKey].count;
    const currentAvg = diffDist[diffKey].averageAccuracy;
    diffDist[diffKey] = {
      count: currentCount + 1,
      averageAccuracy: (currentAvg * currentCount + accuracy) / (currentCount + 1),
    };

    // Update accuracy trend
    const accuracyTrend = [...project.accuracyTrend];
    accuracyTrend.push({
      date: new Date(),
      value: accuracy,
      label: `${questionsCount}Q`,
    });

    // Update study streak
    const today = new Date();
    const lastStudy = project.lastStudyDate;
    let newStreak = project.studyStreak;
    
    if (lastStudy) {
      const daysDiff = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff === 0) {
        // Same day, keep streak
      } else if (daysDiff === 1) {
        // Consecutive day
        newStreak += 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    // Update weekly progress
    const weeklyProgress = this.updateWeeklyProgress(project.weeklyProgress, timeSpent);

    // Calculate overall progress
    const avgSubjectProgress = subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length;

    this.updateProject(projectId, {
      totalQuizzesTaken: project.totalQuizzesTaken + 1,
      totalQuestionsAnswered: totalQuestions,
      averageAccuracy: newAverageAccuracy,
      totalStudyTime: project.totalStudyTime + timeSpent,
      subjects,
      difficultyDistribution: diffDist,
      accuracyTrend,
      studyStreak: newStreak,
      lastStudyDate: today,
      weeklyProgress,
      overallProgress: Math.round(avgSubjectProgress),
    });
  }

  /**
   * Add/update checklist item
   */
  updateChecklistItem(projectId: string, item: ChecklistItem): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const checklist = [...project.masterChecklist];
    const index = checklist.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      checklist[index] = item;
    } else {
      checklist.push(item);
    }

    this.updateProject(projectId, { masterChecklist: checklist });
  }

  /**
   * Complete weekly task
   */
  completeWeeklyTask(
    projectId: string,
    taskId: string,
    actualQuestions: number,
    actualAccuracy: number,
    actualMinutes: number
  ): void {
    const project = this.getProject(projectId);
    if (!project) return;

    const tasks = project.weeklyTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: true,
          actualQuestions,
          actualAccuracy,
          actualMinutes,
          completedAt: new Date(),
        };
      }
      return task;
    });

    this.updateProject(projectId, { weeklyTasks: tasks });
  }

  /**
   * Get project statistics
   */
  getProjectStats(projectId: string): ProjectStats | null {
    const project = this.getProject(projectId);
    if (!project) return null;

    const now = new Date();
    const daysRemaining = Math.ceil((project.targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceStart = Math.ceil((now.getTime() - project.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    const expectedProgress = (daysSinceStart / (daysSinceStart + daysRemaining)) * 100;
    const onTrack = project.overallProgress >= expectedProgress * 0.9; // 90% threshold

    const remainingQuestions = 1000 - project.totalQuestionsAnswered; // estimate
    const recommendedDailyQuestions = Math.ceil(remainingQuestions / Math.max(daysRemaining, 1));

    return {
      daysRemaining,
      progressPercentage: project.overallProgress,
      onTrack,
      recommendedDailyQuestions,
      estimatedCompletionDate: new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000),
    };
  }

  // Private helper methods

  private saveProject(project: StudyProject): void {
    const projects = this.getAllProjects();
    projects.push(project);
    this.saveAllProjects(projects);
  }

  private saveAllProjects(projects: StudyProject[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }

  private generateId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createSubject(name: string): SubjectProgress {
    return {
      id: this.generateId(),
      name,
      progress: 0,
      masteryLevel: 'beginner',
      quizzesTaken: 0,
      averageAccuracy: 0,
      hardModeQuizzes: 0,
      timeSpent: 0,
      needsAttention: false,
    };
  }

  private createWeeklyProgress(weekNumber: number): WeeklyProgress {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      weekNumber,
      startDate: startOfWeek,
      endDate: endOfWeek,
      daysCompleted: [false, false, false, false, false, false, false],
      dailyMinutes: [0, 0, 0, 0, 0, 0, 0],
      totalMinutes: 0,
      goalMet: false,
    };
  }

  private createDefaultChecklist(subjects: string[]): ChecklistItem[] {
    const items: ChecklistItem[] = [
      {
        id: this.generateId(),
        title: 'Complete all subject areas',
        completed: false,
        progress: 0,
        priority: 'high',
        createdAt: new Date(),
      },
      {
        id: this.generateId(),
        title: 'Achieve 80%+ accuracy in each subject',
        completed: false,
        progress: 0,
        priority: 'high',
        createdAt: new Date(),
      },
      {
        id: this.generateId(),
        title: 'Complete 5 full-length mock exams',
        completed: false,
        progress: 0,
        priority: 'high',
        createdAt: new Date(),
      },
      {
        id: this.generateId(),
        title: 'Review all flagged questions',
        completed: false,
        priority: 'medium',
        createdAt: new Date(),
      },
      {
        id: this.generateId(),
        title: 'Complete hard mode for all subjects',
        completed: false,
        progress: 0,
        priority: 'medium',
        createdAt: new Date(),
      },
    ];

    return items;
  }

  private createWeeklyTasks(): WeeklyTask[] {
    const days: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'> = 
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map(day => ({
      id: this.generateId(),
      day,
      description: `Daily practice - ${day}`,
      targetQuestions: 30,
      targetMinutes: 30,
      completed: false,
    }));
  }

  private updateWeeklyProgress(weeklyProgress: WeeklyProgress[], minutesAdded: number): WeeklyProgress[] {
    const now = new Date();
    const currentDayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // Monday = 0
    
    let progress = [...weeklyProgress];
    let currentWeek = progress[progress.length - 1];
    
    // Check if we need a new week
    if (now > currentWeek.endDate) {
      const newWeek = this.createWeeklyProgress(currentWeek.weekNumber + 1);
      progress.push(newWeek);
      currentWeek = newWeek;
    }
    
    // Update current week
    currentWeek.daysCompleted[currentDayOfWeek] = true;
    currentWeek.dailyMinutes[currentDayOfWeek] += minutesAdded;
    currentWeek.totalMinutes += minutesAdded;
    
    return progress;
  }

  private calculateMasteryLevel(accuracy: number, quizzesTaken: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    if (quizzesTaken < 5) return 'beginner';
    if (accuracy >= 90 && quizzesTaken >= 20) return 'expert';
    if (accuracy >= 80 && quizzesTaken >= 10) return 'advanced';
    if (accuracy >= 70) return 'intermediate';
    return 'beginner';
  }

  private dateReviver(key: string, value: unknown): unknown {
    if (typeof value === 'string') {
      const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (datePattern.test(value)) {
        return new Date(value);
      }
    }
    return value;
  }
}

export const projectManager = new ProjectManager();
