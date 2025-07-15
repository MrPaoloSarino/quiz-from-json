import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Zap,
  Plus,
  Settings,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import SkillTreeBuilder from './SkillTreeBuilder';
import PracticeProtocols from './PracticeProtocols';
import { SkillTree, SkillProgress } from '@/types/skill';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import LogEntryTab from './LogEntryTab';

interface SkillAcquisitionAppProps {
  onBack?: () => void;
}

const SkillAcquisitionApp: React.FC<SkillAcquisitionAppProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [skillTrees, setSkillTrees] = useState<SkillTree[]>([]);
  const [currentProgress, setCurrentProgress] = useState<SkillProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSkillData();
  }, []);

  const parseDatesInSkillTrees = (trees: any[]): SkillTree[] => {
    return trees.map(tree => ({
      ...tree,
      startDate: tree.startDate ? new Date(tree.startDate) : null,
      targetEndDate: tree.targetEndDate ? new Date(tree.targetEndDate) : null,
      createdAt: tree.createdAt ? new Date(tree.createdAt) : undefined,
      updatedAt: tree.updatedAt ? new Date(tree.updatedAt) : undefined,
      nodes: tree.nodes?.map((node: any) => ({
        ...node,
        startDate: node.startDate ? new Date(node.startDate) : null,
        targetCompletionDate: node.targetCompletionDate ? new Date(node.targetCompletionDate) : null,
        createdAt: node.createdAt ? new Date(node.createdAt) : undefined,
        updatedAt: node.updatedAt ? new Date(node.updatedAt) : undefined,
      })) || [],
    }));
  };
  const parseDatesInProgress = (progress: any[]): SkillProgress[] => {
    return progress.map(p => ({
      ...p,
      lastPractice: p.lastPractice ? new Date(p.lastPractice) : undefined,
      nextReview: p.nextReview ? new Date(p.nextReview) : undefined,
      startDate: p.startDate ? new Date(p.startDate) : undefined,
      targetCompletionDate: p.targetCompletionDate ? new Date(p.targetCompletionDate) : undefined,
      performanceHistory: p.performanceHistory?.map((h: any) => ({
        ...h,
        date: h.date ? new Date(h.date) : undefined,
      })) || [],
    }));
  };
  const loadSkillData = async () => {
    try {
      let storedTrees = null;
      let storedProgress = null;
      try {
        storedTrees = localStorage.getItem('skillTrees');
        storedProgress = localStorage.getItem('skillProgress');
      } catch (error) {
        toast.error('Error accessing localStorage.');
      }
      if (storedTrees) {
        setSkillTrees(parseDatesInSkillTrees(JSON.parse(storedTrees)));
      }
      if (storedProgress) {
        setCurrentProgress(parseDatesInProgress(JSON.parse(storedProgress)));
      }
    } catch (error) {
      toast.error('Error loading skill data.');
      console.error('Error loading skill data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getOverallProgress = () => {
    if (currentProgress.length === 0) return 0;
    const totalMastery = currentProgress.reduce((sum, progress) => sum + progress.masteryScore, 0);
    return (totalMastery / currentProgress.length) * 100;
  };

  const getTotalTimeInvested = () => {
    return currentProgress.reduce((sum, progress) => sum + progress.timeInvested, 0);
  };

  const getActiveSkills = () => {
    return currentProgress.filter(p => p.masteryScore < 1).length;
  };

  // Helper to get skill name by ID
  function getSkillName(skillId: string, skillTrees: SkillTree[]): string {
    for (const tree of skillTrees) {
      const node = tree.nodes.find(n => n.id === skillId);
      if (node) return node.name;
    }
    return skillId; // fallback to ID if not found
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Brain className="w-8 h-8 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading skill acquisition system...</p>
        </div>
      </div>
    );
  }

  // Environment Setup Tab Component
  interface Ritual {
    name: string;
    description: string;
  }
  interface Sensory {
    music?: string;
    scent?: string;
    lighting?: string;
    posture?: string;
  }
  interface MentalPractice {
    name: string;
    technique: string;
  }
  interface EnvironmentSetup {
    id: string;
    name: string;
    rituals: Ritual[];
    sensory: Sensory;
    mental: MentalPractice[];
  }
  const EnvironmentSetupTab: React.FC<{ setups: EnvironmentSetup[]; onSave: (setups: EnvironmentSetup[]) => void }> = ({ setups, onSave }) => {
    const [rituals, setRituals] = useState<Ritual[]>([]);
    const [sensory, setSensory] = useState<Sensory>({});
    const [mental, setMental] = useState<MentalPractice[]>([]);
    const [setupName, setSetupName] = useState('');
    const [savedSetups, setSavedSetups] = useState<EnvironmentSetup[]>(setups || []);

    useEffect(() => {
      setSavedSetups(setups || []);
    }, [setups]);

    const handleSaveSetup = () => {
      if (!setupName.trim()) {
        toast.error('Setup name is required.');
        return;
      }
      if (!rituals.length && !Object.keys(sensory).length && !mental.length) {
        toast.error('Please add at least one ritual, sensory, or mental practice.');
        return;
      }
      const newSetup: EnvironmentSetup = {
        id: Date.now().toString(),
        name: setupName || `Setup ${savedSetups.length + 1}`,
        rituals: rituals || [],
        sensory: sensory || {},
        mental: mental || [],
      };
      const updated = [...savedSetups, newSetup];
      setSavedSetups(updated);
      onSave(updated);
      setSetupName('');
      setRituals([]);
      setSensory({});
      setMental([]);
      try {
        localStorage.setItem('environmentSetups', JSON.stringify(updated));
        toast.success('Environment setup saved.');
      } catch (error) {
        toast.error('Failed to save environment setup.');
      }
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Pre-Practice Rituals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rituals.map((r, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={r.name} onChange={e => {
                    const arr = [...rituals];
                    arr[i].name = e.target.value;
                    setRituals(arr);
                  }} placeholder="Ritual name" className="w-1/3" />
                  <Input value={r.description} onChange={e => {
                    const arr = [...rituals];
                    arr[i].description = e.target.value;
                    setRituals(arr);
                  }} placeholder="Description" className="w-1/2" />
                  <Button variant="outline" onClick={() => setRituals(rituals.filter((_, idx) => idx !== i))}>Remove</Button>
                </div>
              ))}
              <Button variant="secondary" onClick={() => setRituals([...rituals, { name: '', description: '' }])}>Add Ritual</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sensory Tuning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Input value={sensory.music || ''} onChange={e => setSensory({ ...sensory, music: e.target.value })} placeholder="Music" />
              <Input value={sensory.scent || ''} onChange={e => setSensory({ ...sensory, scent: e.target.value })} placeholder="Scent" />
              <Input value={sensory.lighting || ''} onChange={e => setSensory({ ...sensory, lighting: e.target.value })} placeholder="Lighting" />
              <Input value={sensory.posture || ''} onChange={e => setSensory({ ...sensory, posture: e.target.value })} placeholder="Posture" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mental Reset Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mental.map((m, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input value={m.name} onChange={e => {
                    const arr = [...mental];
                    arr[i].name = e.target.value;
                    setMental(arr);
                  }} placeholder="Practice name" className="w-1/3" />
                  <Input value={m.technique} onChange={e => {
                    const arr = [...mental];
                    arr[i].technique = e.target.value;
                    setMental(arr);
                  }} placeholder="Technique" className="w-1/2" />
                  <Button variant="outline" onClick={() => setMental(mental.filter((_, idx) => idx !== i))}>Remove</Button>
                </div>
              ))}
              <Button variant="secondary" onClick={() => setMental([...mental, { name: '', technique: '' }])}>Add Practice</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Save/Load Environment Setups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-2">
              <Input value={setupName} onChange={e => setSetupName(e.target.value)} placeholder="Setup name" className="w-1/2" />
              <Button onClick={handleSaveSetup}>Save Setup</Button>
            </div>
            <div className="space-y-2">
              {savedSetups.map((s, i) => (
                <Card key={s.id} className="border p-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-gray-500">Rituals: {s.rituals.length}, Sensory: {Object.keys(s.sensory).length}, Mental: {s.mental.length}</div>
                    </div>
                    <Button variant="outline" onClick={() => {
                      setRituals(s.rituals);
                      setSensory(s.sensory);
                      setMental(s.mental);
                    }}>Load</Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-full gap-2 overflow-x-auto rounded-lg bg-muted p-2 mb-4">
        <TabsTrigger value="overview" className="flex items-center gap-2 px-4 py-2">
          <BarChart3 className="w-4 h-4" /> Overview
        </TabsTrigger>
        <TabsTrigger value="skills" className="flex items-center gap-2 px-4 py-2">
          <Brain className="w-4 h-4" /> Skills
        </TabsTrigger>
        <TabsTrigger value="practice" className="flex items-center gap-2 px-4 py-2">
          <Target className="w-4 h-4" /> Practice
        </TabsTrigger>
        <TabsTrigger value="flow" className="flex items-center gap-2 px-4 py-2">
          <Zap className="w-4 h-4" /> Flow
        </TabsTrigger>
        <TabsTrigger value="journal" className="flex items-center gap-2 px-4 py-2">
          <BookOpen className="w-4 h-4" /> Journal
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2 px-4 py-2">
          <Settings className="w-4 h-4" /> Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Skills</h3>
                <p className="text-3xl font-bold">{skillTrees.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Active Skills</h3>
                <p className="text-3xl font-bold">{getActiveSkills()}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Overall Progress</h3>
                <Progress value={getOverallProgress()} className="h-2" />
                <p className="text-sm text-gray-600 mt-1">{getOverallProgress().toFixed(0)}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Time Invested</h3>
                <p className="text-3xl font-bold">{getTotalTimeInvested()} hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">New Skill Added: "Advanced Meditation"</h4>
                <p className="text-sm text-gray-600">Added to "Mindfulness" skill tree.</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Flow Session Completed</h4>
                <p className="text-sm text-gray-600">Session lasted 45 minutes. Flow Score: 8/10</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Journal Entry Added</h4>
                <p className="text-sm text-gray-600">Entry on "Mindfulness and Self-Awareness"</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills">
        <SkillTreeBuilder skillTrees={skillTrees} onUpdate={setSkillTrees} />
      </TabsContent>

      <TabsContent value="practice">
        <PracticeProtocols skillTrees={skillTrees} currentProgress={currentProgress} onUpdateProgress={setCurrentProgress} />
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Environment Setups</h3>
                <Button onClick={() => setActiveTab('environment')}>Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Skill Progress</h3>
                <Button onClick={() => setActiveTab('progress')}>Manage</Button>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Log Types</h3>
                <Button onClick={() => setActiveTab('logTypes')}>Manage</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="environment">
        <EnvironmentSetupTab setups={[]} onSave={() => {}} />
      </TabsContent>

      <TabsContent value="progress">
        <Card>
          <CardHeader>
            <CardTitle>Manage Skill Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentProgress.map((progress, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold">{getSkillName(progress.skillId, skillTrees)}</h4>
                  <p className="text-sm text-gray-600">Mastery: {progress.masteryScore.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Time Invested: {progress.timeInvested} hours</p>
                  <Button variant="outline" onClick={() => {
                    const newProgress = [...currentProgress];
                    newProgress[index] = { ...newProgress[index], masteryScore: 0, timeInvested: 0 };
                    setCurrentProgress(newProgress);
                    localStorage.setItem('skillProgress', JSON.stringify(newProgress));
                    toast.success('Progress reset for this skill.');
                  }}>Reset Progress</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="logTypes">
        <Card>
          <CardHeader>
            <CardTitle>Manage Log Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Flow Sessions</h3>
                <Button onClick={() => setActiveTab('flow')}>Edit</Button>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Journal Entries</h3>
                <Button onClick={() => setActiveTab('journal')}>Edit</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="flow">
        <LogEntryTab
          skillTrees={skillTrees}
          storageKey="flowSessions"
          title="Flow Session"
          addEditTitle="Flow Session"
          recentEntriesTitle="Recent Flow Sessions"
          formFields={[
            { name: 'date', label: 'Date', type: 'date', placeholder: 'Date' },
            { name: 'duration', label: 'Duration (min)', type: 'number', placeholder: 'Duration (min)' },
            { name: 'flowScore', label: 'Flow Score (1-10)', type: 'number', placeholder: 'Flow Score (1-10)' },
            { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Notes' },
          ]}
          renderEntry={(s, skillName) => (
            <div>
              <div className="font-semibold">{skillName}</div>
              <div className="text-xs text-gray-500">{s.date} • {s.duration} min • Flow {s.flowScore}</div>
              <div className="text-xs">{s.notes}</div>
            </div>
          )}
          initialNewEntry={{
            skillId: '',
            date: new Date().toISOString().split('T')[0],
            duration: '',
            flowScore: '',
            notes: '',
          }}
        />
      </TabsContent>

      <TabsContent value="journal">
        <LogEntryTab
          skillTrees={skillTrees}
          storageKey="journalEntries"
          title="Journal Entry"
          addEditTitle="Journal Entry"
          recentEntriesTitle="Recent Journal Entries"
          formFields={[
            { name: 'date', label: 'Date', type: 'date', placeholder: 'Date' },
            { name: 'title', label: 'Title', type: 'text', placeholder: 'Title' },
            { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Content' },
          ]}
          renderEntry={(e, skillName) => (
            <div>
              <div className="font-semibold">{skillName}</div>
              <div className="text-xs text-gray-500">{e.date} • {e.title}</div>
              <div className="text-xs">{e.content}</div>
            </div>
          )}
          initialNewEntry={{
            skillId: '',
            date: new Date().toISOString().split('T')[0],
            title: '',
            content: '',
          }}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SkillAcquisitionApp; 