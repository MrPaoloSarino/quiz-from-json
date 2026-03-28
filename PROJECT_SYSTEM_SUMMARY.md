# Project-Based Study Management System

## Overview
A comprehensive project-focused study management system for exam preparation, built into Cerebrum. This system allows users to create study projects for exams/licensure tests with tracking, analytics, and consistency monitoring.

## What Was Built

### 1. Core Types (`src/types/project.ts`)
- `StudyProject` - Main project interface with all tracking data
- `SubjectProgress` - Individual subject/topic progress tracking
- `WeeklyProgress` - Weekly consistency tracking
- `ChecklistItem` - Master checklist items
- `WeeklyTask` - Daily/weekly task management
- `WeakArea` - Identifies areas needing attention
- `ProjectStats` - Calculated statistics and recommendations

### 2. Project Manager (`src/utils/projectManager.ts`)
Handles all project data management:
- Create, read, update, delete projects
- Record quiz completions and update stats
- Track study streaks and consistency
- Calculate mastery levels
- Manage checklists and weekly tasks
- Generate project statistics and recommendations
- Local storage persistence

### 3. UI Components

#### ProjectsList (`src/pages/ProjectsList.tsx`)
- View all active/archived projects
- Create new projects
- Quick stats overview per project
- Archive/delete projects
- Status badges (due soon, overdue, etc.)

#### CreateProject (`src/pages/CreateProject.tsx`)
- Project creation wizard
- Set name, description, target date
- Add subjects/topics
- Configure daily study goals
- Preset subject suggestions

#### ProjectOverview (`src/pages/ProjectOverview.tsx`)
Main project dashboard with:
- **Project Header** - Name, target date, days remaining, overall progress
- **Quick Stats** - Total quizzes, avg accuracy, study streak, hours logged
- **Weekly Consistency Tracker** - Visual 7-day grid for last 4 weeks
- **Subject Breakdown** - Progress, mastery level, stats per subject
- **Master Checklist** - Pre-exam checklist with progress tracking
- **Weekly Tasks** - Daily task list with completion tracking
- **Performance Analytics** - Accuracy trends, difficulty distribution, time analysis
- **Weak Areas** - AI-powered recommendations for improvement

### 4. Integration with Main App
- Added "Projects" navigation button
- New app views: `projects`, `project-overview`, `create-project`
- Persistent view mounting for seamless navigation
- Session storage for selected project ID

## Key Features

### Progress Tracking
- Overall progress percentage
- Subject-specific progress
- Quiz completion tracking
- Time spent tracking
- Accuracy trends over time

### Consistency Monitoring
- Daily study streak counter
- Weekly consistency grid (7 days × 4 weeks)
- Daily goal tracking (minutes)
- Visual completion indicators

### Analytics & Insights
- Accuracy trends (line chart data ready)
- Difficulty distribution (easy/medium/hard)
- Time per question analysis
- Peak performance time detection
- Weak area identification

### Mastery System
- 4 levels: Beginner → Intermediate → Advanced → Expert
- Based on accuracy + quiz count
- Visual badges for each level
- "Needs Attention" flags for struggling subjects

### Checklist System
- Master checklist for exam preparation
- Progress tracking on checklist items
- Priority levels (high/medium/low)
- Due date tracking

### Weekly Tasks
- 7-day task planning
- Target questions per day
- Completion tracking with actual stats
- Accuracy recording per task

## Data Flow

### When User Takes a Quiz:
1. Quiz completion triggers `projectManager.recordQuizCompletion()`
2. Updates overall stats (total quizzes, questions, accuracy)
3. Updates subject-specific progress
4. Updates difficulty distribution
5. Adds data point to accuracy trend
6. Updates study streak
7. Updates weekly progress grid
8. Recalculates overall progress

### Project Statistics Calculation:
- Days remaining until target date
- On-track status (comparing actual vs expected progress)
- Recommended daily questions to meet goal
- Estimated completion date

## Storage
- Uses localStorage for persistence
- Key: `cerebrum_study_projects`
- Active project key: `cerebrum_active_project`
- JSON serialization with date revival
- Automatic save on all updates

## Next Steps / TODO

### Integration Tasks:
1. **Connect Quiz System** - Link quiz completions to project tracking
2. **Subject Mapping** - Map quiz topics to project subjects
3. **Auto-tracking** - Automatically record quiz results to active project
4. **Dashboard Integration** - Show active project widget on main dashboard

### Enhancement Ideas:
1. **Charts** - Add visual charts for accuracy trends
2. **Export** - Export project data/progress reports
3. **Sharing** - Share progress with study groups
4. **Reminders** - Daily study reminders
5. **Achievements** - Gamification badges
6. **AI Recommendations** - Smart study plan suggestions
7. **Calendar View** - Study schedule calendar
8. **Mobile Optimization** - Better mobile experience

### Advanced Features:
1. **Multi-user** - Study group projects
2. **Cloud Sync** - Sync across devices
3. **Templates** - Pre-built project templates for common exams
4. **Analytics Dashboard** - Advanced analytics page
5. **Spaced Repetition** - Integrate spaced repetition algorithm
6. **Flashcard Integration** - Link flashcards to projects

## Usage Example

```typescript
// Create a new project
const project = projectManager.createProject({
  name: 'Psychometrician Board Exam 2026',
  description: 'Comprehensive preparation for licensure exam',
  targetDate: new Date('2026-03-15'),
  weeklyGoal: 30, // 30 minutes per day
  subjects: [
    'Theories of Personality',
    'Abnormal Psychology',
    'Psychological Assessment',
    'Industrial-Organizational Psychology'
  ]
});

// Record quiz completion
projectManager.recordQuizCompletion(
  project.id,
  subjectId,
  50, // questions count
  85, // accuracy percentage
  45, // time spent in minutes
  'medium' // difficulty
);

// Get project stats
const stats = projectManager.getProjectStats(project.id);
console.log(`Days remaining: ${stats.daysRemaining}`);
console.log(`On track: ${stats.onTrack}`);
console.log(`Recommended daily: ${stats.recommendedDailyQuestions} questions`);
```

## File Structure
```
src/
├── types/
│   └── project.ts              # TypeScript interfaces
├── utils/
│   └── projectManager.ts       # Project data management
├── pages/
│   ├── ProjectsList.tsx        # All projects view
│   ├── CreateProject.tsx       # Project creation
│   └── ProjectOverview.tsx     # Main project dashboard
└── components/
    └── QuizMasterApp.tsx       # Updated with project navigation
```

## Philosophy Alignment
This system aligns with your study philosophy:
- **Project-focused** - Each exam is a project with clear goals
- **Consistency** - Weekly tracking encourages daily practice
- **Progress-based** - Visual progress motivates continued effort
- **Data-driven** - Analytics identify weak areas
- **Adaptive** - Recommendations adjust based on performance
- **Comprehensive** - Covers all aspects of exam preparation

## Status
✅ Core types defined
✅ Project manager implemented
✅ UI components created
✅ Navigation integrated
⏳ Quiz system integration (next step)
⏳ Analytics charts (future enhancement)
⏳ Mobile optimization (future enhancement)
