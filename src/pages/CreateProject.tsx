import React, { useState } from 'react';
import { projectManager } from '@/utils/projectManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Calendar, Target, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface CreateProjectProps {
  onProjectCreated?: (projectId: string) => void;
  onCancel?: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ onProjectCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState(30);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState('');

  const handleAddSubject = () => {
    if (currentSubject.trim() && !subjects.includes(currentSubject.trim())) {
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (!targetDate) {
      toast.error('Please select a target date');
      return;
    }

    if (subjects.length === 0) {
      toast.error('Please add at least one subject');
      return;
    }

    try {
      const project = projectManager.createProject({
        name: name.trim(),
        description: description.trim(),
        targetDate: new Date(targetDate),
        weeklyGoal,
        subjects,
      });

      toast.success(`Project "${project.name}" created successfully!`);
      onProjectCreated?.(project.id);
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
  };

  const presetSubjects = [
    'Theories of Personality',
    'Abnormal Psychology',
    'Psychological Assessment',
    'Industrial-Organizational Psychology',
    'Developmental Psychology',
    'Social Psychology',
    'Cognitive Psychology',
    'Research Methods',
  ];

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Target className="w-6 h-6" />
            Create New Study Project
          </CardTitle>
          <CardDescription>
            Set up a project-focused study plan for your exam or licensure preparation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Psychometrician Board Exam 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your study goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Target Date */}
            <div className="space-y-2">
              <Label htmlFor="targetDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Target Exam Date *
              </Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Weekly Goal */}
            <div className="space-y-2">
              <Label htmlFor="weeklyGoal">Daily Study Goal (minutes)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="weeklyGoal"
                  type="number"
                  min={10}
                  max={480}
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 30)}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">
                  {weeklyGoal} minutes/day = {(weeklyGoal * 7 / 60).toFixed(1)} hours/week
                </span>
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Subjects/Topics *
              </Label>
              
              {/* Current Subjects */}
              {subjects.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                  {subjects.map((subject) => (
                    <Badge key={subject} variant="secondary" className="text-sm">
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Subject */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter subject name..."
                  value={currentSubject}
                  onChange={(e) => setCurrentSubject(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubject();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSubject}
                  variant="outline"
                  disabled={!currentSubject.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Preset Subjects */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {presetSubjects
                    .filter(preset => !subjects.includes(preset))
                    .map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSubjects([...subjects, preset])}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {preset}
                      </Button>
                    ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Create Project
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Your project dashboard will track progress across all subjects</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Weekly consistency tracker helps you maintain study habits</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Master checklist keeps you on track for exam day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Analytics show your strengths and areas needing attention</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProject;
