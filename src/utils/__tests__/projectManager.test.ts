/**
 * Manual test file for Project Manager
 * Run these tests in browser console to verify functionality
 */

import { projectManager } from '../projectManager';

// Test 1: Create a project
export function testCreateProject() {
  console.log('🧪 Test 1: Creating a project...');
  
  const project = projectManager.createProject({
    name: 'Test Psychometrician Exam 2026',
    description: 'Test project for exam preparation',
    targetDate: new Date('2026-06-15'),
    weeklyGoal: 30,
    subjects: [
      'Theories of Personality',
      'Abnormal Psychology',
      'Psychological Assessment',
    ],
  });

  console.log('✅ Project created:', project);
  console.assert(project.id, 'Project should have an ID');
  console.assert(project.name === 'Test Psychometrician Exam 2026', 'Project name should match');
  console.assert(project.subjects.length === 3, 'Should have 3 subjects');
  
  return project;
}

// Test 2: Get all projects
export function testGetAllProjects() {
  console.log('🧪 Test 2: Getting all projects...');
  
  const projects = projectManager.getAllProjects();
  console.log('✅ All projects:', projects);
  console.assert(projects.length > 0, 'Should have at least one project');
  
  return projects;
}

// Test 3: Record quiz completion
export function testRecordQuizCompletion(projectId: string) {
  console.log('🧪 Test 3: Recording quiz completion...');
  
  const project = projectManager.getProject(projectId);
  if (!project) {
    console.error('❌ Project not found');
    return;
  }

  const subjectId = project.subjects[0].id;
  
  projectManager.recordQuizCompletion(
    projectId,
    subjectId,
    20, // 20 questions
    85, // 85% accuracy
    25, // 25 minutes
    'medium'
  );

  const updatedProject = projectManager.getProject(projectId);
  console.log('✅ Project after quiz:', updatedProject);
  console.assert(updatedProject?.totalQuizzesTaken === 1, 'Should have 1 quiz taken');
  console.assert(updatedProject?.totalQuestionsAnswered === 20, 'Should have 20 questions answered');
  
  return updatedProject;
}

// Test 4: Get project stats
export function testGetProjectStats(projectId: string) {
  console.log('🧪 Test 4: Getting project stats...');
  
  const stats = projectManager.getProjectStats(projectId);
  console.log('✅ Project stats:', stats);
  console.assert(stats !== null, 'Stats should exist');
  console.assert(stats?.daysRemaining > 0, 'Should have days remaining');
  
  return stats;
}

// Test 5: Update checklist item
export function testUpdateChecklistItem(projectId: string) {
  console.log('🧪 Test 5: Updating checklist item...');
  
  const project = projectManager.getProject(projectId);
  if (!project) {
    console.error('❌ Project not found');
    return;
  }

  const firstItem = project.masterChecklist[0];
  projectManager.updateChecklistItem(projectId, {
    ...firstItem,
    completed: true,
    progress: 100,
  });

  const updatedProject = projectManager.getProject(projectId);
  console.log('✅ Updated checklist:', updatedProject?.masterChecklist[0]);
  console.assert(updatedProject?.masterChecklist[0].completed === true, 'Item should be completed');
  
  return updatedProject;
}

// Test 6: Complete weekly task
export function testCompleteWeeklyTask(projectId: string) {
  console.log('🧪 Test 6: Completing weekly task...');
  
  const project = projectManager.getProject(projectId);
  if (!project) {
    console.error('❌ Project not found');
    return;
  }

  const firstTask = project.weeklyTasks[0];
  projectManager.completeWeeklyTask(
    projectId,
    firstTask.id,
    30, // 30 questions
    88, // 88% accuracy
    35  // 35 minutes
  );

  const updatedProject = projectManager.getProject(projectId);
  console.log('✅ Updated task:', updatedProject?.weeklyTasks[0]);
  console.assert(updatedProject?.weeklyTasks[0].completed === true, 'Task should be completed');
  
  return updatedProject;
}

// Test 7: Archive project
export function testArchiveProject(projectId: string) {
  console.log('🧪 Test 7: Archiving project...');
  
  const archivedProject = projectManager.toggleArchive(projectId);
  console.log('✅ Archived project:', archivedProject);
  console.assert(archivedProject?.isArchived === true, 'Project should be archived');
  
  // Unarchive it
  const unarchivedProject = projectManager.toggleArchive(projectId);
  console.log('✅ Unarchived project:', unarchivedProject);
  console.assert(unarchivedProject?.isArchived === false, 'Project should be unarchived');
  
  return unarchivedProject;
}

// Test 8: Delete project
export function testDeleteProject(projectId: string) {
  console.log('🧪 Test 8: Deleting project...');
  
  const deleted = projectManager.deleteProject(projectId);
  console.log('✅ Project deleted:', deleted);
  console.assert(deleted === true, 'Delete should return true');
  
  const project = projectManager.getProject(projectId);
  console.assert(project === null, 'Project should not exist');
  
  return deleted;
}

// Run all tests
export function runAllTests() {
  console.log('🚀 Starting Project Manager Tests...\n');
  
  try {
    // Test 1: Create
    const project = testCreateProject();
    console.log('\n');
    
    // Test 2: Get all
    testGetAllProjects();
    console.log('\n');
    
    // Test 3: Record quiz
    testRecordQuizCompletion(project.id);
    console.log('\n');
    
    // Test 4: Get stats
    testGetProjectStats(project.id);
    console.log('\n');
    
    // Test 5: Update checklist
    testUpdateChecklistItem(project.id);
    console.log('\n');
    
    // Test 6: Complete task
    testCompleteWeeklyTask(project.id);
    console.log('\n');
    
    // Test 7: Archive
    testArchiveProject(project.id);
    console.log('\n');
    
    // Test 8: Delete
    testDeleteProject(project.id);
    console.log('\n');
    
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  (window as any).projectManagerTests = {
    runAllTests,
    testCreateProject,
    testGetAllProjects,
    testRecordQuizCompletion,
    testGetProjectStats,
    testUpdateChecklistItem,
    testCompleteWeeklyTask,
    testArchiveProject,
    testDeleteProject,
  };
}
