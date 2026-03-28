/**
 * Initialize demo project data for testing
 * This creates a sample project with realistic data
 */

import { projectManager } from './projectManager';

export function initDemoProject() {
  // Check if demo already exists
  const existing = projectManager.getAllProjects();
  if (existing.length > 0) {
    console.log('✅ Projects already exist, skipping demo creation');
    return existing[0];
  }

  console.log('🚀 Creating demo project...');

  // Create a demo project
  const project = projectManager.createProject({
    name: 'Psychometrician Board Exam 2026',
    description: 'Comprehensive preparation for the Psychometrician Licensure Examination',
    targetDate: new Date('2026-06-15'),
    weeklyGoal: 45, // 45 minutes per day
    subjects: [
      'Theories of Personality',
      'Abnormal Psychology',
      'Psychological Assessment',
      'Industrial-Organizational Psychology',
    ],
  });

  console.log('✅ Demo project created:', project.name);

  // Simulate some quiz completions to show progress
  const subjects = project.subjects;

  // Subject 1: Theories of Personality - Good progress
  projectManager.recordQuizCompletion(
    project.id,
    subjects[0].id,
    30,
    87,
    35,
    'medium'
  );
  projectManager.recordQuizCompletion(
    project.id,
    subjects[0].id,
    25,
    92,
    28,
    'easy'
  );
  projectManager.recordQuizCompletion(
    project.id,
    subjects[0].id,
    40,
    78,
    52,
    'hard'
  );

  // Subject 2: Abnormal Psychology - Moderate progress
  projectManager.recordQuizCompletion(
    project.id,
    subjects[1].id,
    35,
    75,
    42,
    'medium'
  );
  projectManager.recordQuizCompletion(
    project.id,
    subjects[1].id,
    20,
    82,
    24,
    'easy'
  );

  // Subject 3: Psychological Assessment - Needs attention
  projectManager.recordQuizCompletion(
    project.id,
    subjects[2].id,
    25,
    65,
    38,
    'medium'
  );

  // Subject 4: IO Psychology - Just started
  projectManager.recordQuizCompletion(
    project.id,
    subjects[3].id,
    15,
    70,
    22,
    'easy'
  );

  // Complete some checklist items
  const updatedProject = projectManager.getProject(project.id);
  if (updatedProject) {
    // Mark first checklist item as in progress
    projectManager.updateChecklistItem(project.id, {
      ...updatedProject.masterChecklist[0],
      progress: 75,
    });

    // Complete a weekly task
    const mondayTask = updatedProject.weeklyTasks.find(t => t.day === 'Mon');
    if (mondayTask) {
      projectManager.completeWeeklyTask(
        project.id,
        mondayTask.id,
        30,
        85,
        40
      );
    }

    // Complete another task
    const tuesdayTask = updatedProject.weeklyTasks.find(t => t.day === 'Tue');
    if (tuesdayTask) {
      projectManager.completeWeeklyTask(
        project.id,
        tuesdayTask.id,
        25,
        78,
        35
      );
    }
  }

  console.log('✅ Demo data populated with quiz completions and progress');
  
  const finalProject = projectManager.getProject(project.id);
  console.log('📊 Final project stats:', {
    totalQuizzes: finalProject?.totalQuizzesTaken,
    avgAccuracy: finalProject?.averageAccuracy.toFixed(1) + '%',
    studyTime: (finalProject?.totalStudyTime || 0) + ' minutes',
    streak: finalProject?.studyStreak + ' days',
  });

  return finalProject;
}

// Auto-initialize on import in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Make it available globally for console testing
  (window as any).initDemoProject = initDemoProject;
  console.log('💡 Tip: Run initDemoProject() in console to create demo project');
}
