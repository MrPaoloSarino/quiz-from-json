import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Clock, 
  Target, 
  Zap,
  BookOpen,
  BarChart3,
  CheckCircle,
  Timer
} from 'lucide-react';
import { SkillTree, SkillProgress, PracticeProtocol, FlowSession } from '@/types/skill';

interface PracticeProtocolsProps {
  skillTrees: SkillTree[];
  currentProgress: SkillProgress[];
  onUpdateProgress: (progress: SkillProgress[]) => void;
}

const PracticeProtocols: React.FC<PracticeProtocolsProps> = ({
  skillTrees,
  currentProgress,
  onUpdateProgress
}) => {
  const [activeSession, setActiveSession] = useState<{
    skillId: string;
    protocol: PracticeProtocol;
    startTime: Date;
  } | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [sessionQuality, setSessionQuality] = useState(5);
  const [retentionScore, setRetentionScore] = useState(0);
  const [challengePassRate, setChallengePassRate] = useState(0);
  const [improvements, setImprovements] = useState<string>('');

  const getSkillProgress = (skillId: string) => {
    return currentProgress.find(p => p.skillId === skillId);
  };

  const startPracticeSession = (skillId: string, protocol: PracticeProtocol) => {
    setActiveSession({
      skillId,
      protocol,
      startTime: new Date()
    });
  };

  const endPracticeSession = () => {
    if (!activeSession) return;

    const duration = (Date.now() - activeSession.startTime.getTime()) / 1000 / 60; // minutes
    
    // Update progress
    const existingProgress = getSkillProgress(activeSession.skillId);
    const updatedProgress: SkillProgress = existingProgress ? {
      ...existingProgress,
      timeInvested: existingProgress.timeInvested + duration,
      sessionsCompleted: existingProgress.sessionsCompleted + 1,
      lastPractice: new Date(),
      performanceHistory: [
        ...existingProgress.performanceHistory,
        {
          skillId: activeSession.skillId,
          date: new Date(),
          timeSpent: duration,
          sessionQuality,
          retentionScore: retentionScore,
          challengePassRate: challengePassRate / 100, // Store as 0-1
          flowTime: 0,
          improvements: improvements.split('\n').filter(Boolean).map(desc => ({ date: new Date(), metric: 'general', change: 0, description: desc }))
        }
      ]
    } : {
      skillId: activeSession.skillId,
      userId: 'current', // TODO: Get actual user ID
      currentLevel: 1,
      masteryScore: 0.1,
      timeInvested: duration,
      sessionsCompleted: 1,
      lastPractice: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      startDate: new Date(),
      targetCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      weeklyGoal: 1,
      currentWeekProgress: 0,
      streak: 0,
      flowSessions: [],
      performanceHistory: [{
        skillId: activeSession.skillId,
        date: new Date(),
        timeSpent: duration,
        sessionQuality,
        retentionScore: retentionScore,
        challengePassRate: challengePassRate / 100,
        flowTime: 0,
        improvements: improvements.split('\n').filter(Boolean).map(desc => ({ date: new Date(), metric: 'general', change: 0, description: desc }))
      }],
      journalEntries: [],
      environmentSetups: [],
      ganttData: [],
    };

    const updatedProgressList = existingProgress 
      ? currentProgress.map(p => p.skillId === activeSession.skillId ? updatedProgress : p)
      : [...currentProgress, updatedProgress];

    onUpdateProgress(updatedProgressList);
    localStorage.setItem('skillProgress', JSON.stringify(updatedProgressList));
    
    setActiveSession(null);
    setSessionQuality(5);
    setRetentionScore(0);
    setChallengePassRate(0);
    setImprovements('');
  };

  const getRecommendedProtocols = (skillId: string) => {
    const skill = skillTrees
      .flatMap(tree => tree.nodes)
      .find(node => node.id === skillId);
    
    if (!skill) return [];

    const progress = getSkillProgress(skillId);
    const level = progress?.currentLevel || 1;

    // Return different protocols based on skill level and progress
    const protocols: PracticeProtocol[] = [
      {
        id: 'deliberate-1',
        name: 'Deliberate Practice Session',
        type: 'deliberate',
        duration: 25,
        frequency: 'daily',
        instructions: [
          'Focus on one specific micro-skill',
          'Practice at 85% difficulty level',
          'Get immediate feedback',
          'Repeat until mastery'
        ],
        materials: ['Practice materials', 'Timer', 'Feedback mechanism'],
        successMetrics: ['Accuracy > 90%', 'Speed improvement', 'Consistency'],
        flowTriggers: [
          { type: 'difficulty', value: '85%', description: 'Optimal challenge level' },
          { type: 'feedback', value: 'immediate', description: 'Instant feedback loop' }
        ],
        scheduledSessions: []
      },
      {
        id: 'simulation-1',
        name: 'Real-World Simulation',
        type: 'simulation',
        duration: 45,
        frequency: 'weekly',
        instructions: [
          'Create realistic scenario',
          'Apply multiple skills together',
          'Handle unexpected challenges',
          'Document learnings'
        ],
        materials: ['Scenario setup', 'Real-world constraints', 'Documentation tools'],
        successMetrics: ['Scenario completion', 'Problem-solving', 'Adaptation'],
        flowTriggers: [
          { type: 'novelty', value: 'high', description: 'New challenges' },
          { type: 'time', value: 'pressure', description: 'Time constraints' }
        ],
        scheduledSessions: []
      },
      {
        id: 'review-1',
        name: 'Spaced Repetition Review',
        type: 'review',
        duration: 15,
        frequency: 'daily',
        instructions: [
          'Review previous learnings',
          'Test retention',
          'Identify gaps',
          'Plan next session'
        ],
        materials: ['Review materials', 'Self-test questions', 'Progress tracker'],
        successMetrics: ['Retention rate', 'Gap identification', 'Planning quality'],
        flowTriggers: [
          { type: 'feedback', value: 'self-assessment', description: 'Self-evaluation' }
        ],
        scheduledSessions: []
      }
    ];

    return protocols;
  };

  function formatDate(date: string | Date | null | undefined): string {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    return d.toLocaleDateString();
  }

  function getSkillName(skillId: string): string {
    for (const tree of skillTrees) {
      const node = tree.nodes.find(n => n.id === skillId);
      if (node) return node.name;
    }
    return skillId; // fallback to ID if not found
  }

  return (
    <div className="space-y-6">
      {/* Active Session */}
      {activeSession && (
        <Card className="border-green-500 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Play className="w-5 h-5" />
              Active Practice Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{activeSession.protocol.name}</h4>
                <p className="text-sm text-gray-600">
                  Duration: {activeSession.protocol.duration} minutes
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Quality (1-10)</label>
                <Select value={sessionQuality.toString()} onValueChange={(value) => setSessionQuality(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                      <SelectItem key={score} value={score.toString()}>
                        {score} - {score <= 3 ? 'Poor' : score <= 6 ? 'Good' : score <= 8 ? 'Very Good' : 'Excellent'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Retention Score (0-10)</label>
                <Input
                  type="number"
                  value={retentionScore}
                  onChange={(e) => setRetentionScore(parseInt(e.target.value) || 0)}
                  min="0"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Challenge Pass Rate (0-100%)</label>
                <Input
                  type="number"
                  value={challengePassRate}
                  onChange={(e) => setChallengePassRate(parseInt(e.target.value) || 0)}
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Improvements/Notes</label>
                <Textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="What went well? What can be improved?"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={endPracticeSession} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  End Session
                </Button>
                <Button variant="outline" onClick={() => setActiveSession(null)}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Skill to Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a skill to practice..." />
            </SelectTrigger>
            <SelectContent>
              {skillTrees.flatMap(tree => 
                tree.nodes.map(node => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name} ({tree.name})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Practice Protocols */}
      {selectedSkill && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Practice Protocols</h3>
          
          {getRecommendedProtocols(selectedSkill).map((protocol) => (
            <Card key={protocol.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {protocol.name}
                      <Badge variant={
                        protocol.type === 'deliberate' ? 'default' :
                        protocol.type === 'simulation' ? 'secondary' :
                        'outline'
                      }>
                        {protocol.type}
                      </Badge>
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {protocol.duration} minutes • {protocol.frequency}
                    </p>
                  </div>
                  <Button 
                    onClick={() => startPracticeSession(selectedSkill, protocol)}
                    disabled={!!activeSession}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Instructions</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {protocol.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {instruction}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-sm mb-2">Success Metrics</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {protocol.successMetrics.map((metric, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Target className="w-3 h-3 mt-1 text-green-500" />
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium text-sm mb-2">Flow Triggers</h5>
                  <div className="flex flex-wrap gap-2">
                    {protocol.flowTriggers.map((trigger, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {trigger.type}: {trigger.value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Recent Practice Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentProgress.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No practice sessions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentProgress
                .filter(p => p.performanceHistory.length > 0)
                .flatMap(p => p.performanceHistory)
                .sort((a, b) => {
                  const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
                  const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
                  return dateB.getTime() - dateA.getTime();
                })
                .slice(0, 5)
                .map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{getSkillName(session.skillId)}</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(session.date)} {/* You can add more session info here if needed */}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

export default PracticeProtocols;