import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { GanttTask, SkillNode, Milestone } from '@/types/skill';

interface GanttChartProps {
  tasks: GanttTask[];
  skillNodes: SkillNode[];
  milestones: Milestone[];
  startDate: Date;
  endDate: Date;
  onTaskClick?: (task: GanttTask) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  skillNodes,
  milestones,
  startDate,
  endDate,
  onTaskClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = week, 2 = day, 3 = hour

  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const visibleDays = Math.min(30, totalDays); // Show max 30 days at a time

  const getDatePosition = (date: Date) => {
    const daysFromStart = (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return (daysFromStart / totalDays) * 100;
  };

  const getTaskWidth = (task: GanttTask) => {
    const taskDays = (task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24);
    return (taskDays / totalDays) * 100;
  };

  const getTaskStatusColor = (status: GanttTask['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getTaskTypeIcon = (type: GanttTask['type']) => {
    switch (type) {
      case 'skill': return <Target className="w-3 h-3" />;
      case 'milestone': return <CheckCircle className="w-3 h-3" />;
      case 'review': return <Clock className="w-3 h-3" />;
      case 'test': return <AlertCircle className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineHeaders = () => {
    const headers = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < visibleDays; i++) {
      headers.push({
        date: new Date(current),
        label: current.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      });
      current.setDate(current.getDate() + 1);
    }
    
    return headers;
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.status !== 'completed' && 
      task.end < now
    );
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return tasks.filter(task => 
      task.status !== 'completed' && 
      task.start >= now && 
      task.start <= nextWeek
    );
  };

  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">
            {formatDate(currentDate)} - {formatDate(new Date(currentDate.getTime() + visibleDays * 24 * 60 * 60 * 1000))}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-600">
            {zoomLevel === 1 ? 'Week' : zoomLevel === 2 ? 'Day' : 'Hour'} View
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(Math.min(3, zoomLevel + 1))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {(overdueTasks.length > 0 || upcomingTasks.length > 0) && (
        <div className="space-y-2">
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">{overdueTasks.length} overdue task(s)</span>
              </div>
              <div className="mt-2 space-y-1">
                {overdueTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-sm text-red-700">
                    • {task.name} (due {formatDate(task.end)})
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {upcomingTasks.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{upcomingTasks.length} upcoming task(s)</span>
              </div>
              <div className="mt-2 space-y-1">
                {upcomingTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="text-sm text-blue-700">
                    • {task.name} (starts {formatDate(task.start)})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Skill Acquisition Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="flex border-b">
                <div className="w-48 p-2 font-medium text-sm">Task</div>
                {getTimelineHeaders().map((header, index) => (
                  <div 
                    key={index} 
                    className="flex-1 p-2 text-center text-xs border-l"
                    style={{ minWidth: '60px' }}
                  >
                    <div className="font-medium">{header.label}</div>
                    <div className="text-gray-500">
                      {header.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tasks */}
              <div className="space-y-1">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="flex items-center border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => onTaskClick?.(task)}
                  >
                    <div className="w-48 p-2 text-sm">
                      <div className="flex items-center gap-2">
                        {getTaskTypeIcon(task.type)}
                        <span className="font-medium">{task.name}</span>
                        <Badge 
                          variant={task.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(task.start)} - {formatDate(task.end)}
                      </div>
                    </div>
                    
                    <div className="flex-1 relative h-12">
                      <div 
                        className={`absolute top-2 h-8 rounded ${getTaskStatusColor(task.status)} opacity-80 hover:opacity-100 transition-opacity`}
                        style={{
                          left: `${getDatePosition(task.start)}%`,
                          width: `${getTaskWidth(task)}%`,
                          minWidth: '20px'
                        }}
                      >
                        <div className="flex items-center justify-center h-full text-white text-xs px-2">
                          {task.progress}%
                        </div>
                      </div>
                      
                      {/* Progress indicator */}
                      <div 
                        className="absolute top-2 h-8 bg-green-600 rounded-l opacity-60"
                        style={{
                          left: `${getDatePosition(task.start)}%`,
                          width: `${(getTaskWidth(task) * task.progress) / 100}%`,
                          minWidth: '2px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Task Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Tasks:</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed:</span>
              <span className="font-medium text-green-600">
                {tasks.filter(t => t.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">In Progress:</span>
              <span className="font-medium text-blue-600">
                {tasks.filter(t => t.status === 'in-progress').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Delayed:</span>
              <span className="font-medium text-red-600">
                {tasks.filter(t => t.status === 'delayed').length}
              </span>
            </div>
            <Progress 
              value={(tasks.filter(t => t.status === 'completed').length / tasks.length) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Timeline Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Start Date:</span>
              <span className="font-medium">{formatDate(startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">End Date:</span>
              <span className="font-medium">{formatDate(endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Duration:</span>
              <span className="font-medium">{totalDays} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Progress:</span>
              <span className="font-medium">
                {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GanttChart; 