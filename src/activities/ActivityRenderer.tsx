import React from 'react';
import type { LearningActivity } from '@/types/learning';
import { activityRegistry } from './activityRegistry';

// Placeholder imports for activity UIs
// import QuizActivity from './QuizActivity';
// import ReflectionActivity from './ReflectionActivity';

interface ActivityRendererProps {
  activity: LearningActivity;
}

export const ActivityRenderer: React.FC<ActivityRendererProps> = ({ activity }) => {
  // In the future, use registry to dynamically import/render the right component
  switch (activity.type) {
    case 'quiz':
      return <div>Quiz activity rendering not yet implemented.</div>;
    case 'reflection':
      return <div>Reflection Journal rendering not yet implemented.</div>;
    // Add more cases as new activity types are added
    default:
      return <div>Unknown activity type: {activity.type}</div>;
  }
}; 