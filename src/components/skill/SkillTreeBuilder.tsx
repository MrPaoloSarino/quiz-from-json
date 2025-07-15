import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  ArrowRight,
  Brain,
  Clock,
  CheckCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SkillTree, SkillNode, MicroSkill, CompletionCriteria, RealWorldTest, Milestone } from '@/types/skill';
import { Progress } from '@/components/ui/progress';

interface SkillTreeBuilderProps {
  skillTrees: SkillTree[];
  onUpdate: (trees: SkillTree[]) => void;
}

const SkillTreeBuilder: React.FC<SkillTreeBuilderProps> = ({ skillTrees, onUpdate }) => {
  const [selectedTree, setSelectedTree] = useState<SkillTree | null>(null);
  const [isCreatingTree, setIsCreatingTree] = useState(false);
  const [isEditingTree, setIsEditingTree] = useState(false);
  const [editingTreeData, setEditingTreeData] = useState<SkillTree | null>(null);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editingNodeData, setEditingNodeData] = useState<SkillNode | null>(null);
  const [newTree, setNewTree] = useState({
    name: '',
    description: '',
    category: '',
    startDate: new Date(),
    targetEndDate: new Date(),
    priority: 'medium' as const
  });
  const [newNode, setNewNode] = useState({
    name: '',
    description: '',
    category: '',
    level: 1,
    estimatedHours: 1,
    startDate: new Date(),
    targetCompletionDate: new Date(),
    microSkills: [] as MicroSkill[],
    completionCriteria: [] as CompletionCriteria[],
  });
  const [treeError, setTreeError] = useState<string | null>(null);
  const [nodeError, setNodeError] = useState<string | null>(null);

  const handleCreateTree = () => {
    setTreeError(null);
    if (!newTree.startDate) {
      setTreeError('Please select a start date.');
      return;
    }
    const tree: SkillTree = {
      id: Date.now().toString(),
      name: newTree.name,
      description: newTree.description,
      category: newTree.category,
      nodes: [],
      connections: [],
      startDate: newTree.startDate || new Date(),
      targetEndDate: newTree.targetEndDate || new Date(),
      status: 'planning',
      priority: newTree.priority,
      progress: 0,
      milestones: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0'
    };

    const updatedTrees = [...skillTrees, tree];
    onUpdate(updatedTrees);
    localStorage.setItem('skillTrees', JSON.stringify(updatedTrees));
    setNewTree({
      name: '',
      description: '',
      category: '',
      startDate: new Date(),
      targetEndDate: new Date(),
      priority: 'medium'
    });
    setIsCreatingTree(false);
    setSelectedTree(tree);
  };

  const handleEditTree = () => {
    setTreeError(null);
    if (!editingTreeData || !editingTreeData.startDate) {
      setTreeError('Please select a start date.');
      return;
    }

    const updatedTrees = skillTrees.map(tree =>
      tree.id === editingTreeData.id ? { ...editingTreeData, updatedAt: new Date() } : tree
    );

    onUpdate(updatedTrees);
    localStorage.setItem('skillTrees', JSON.stringify(updatedTrees));
    setIsEditingTree(false);
    setEditingTreeData(null);
    setSelectedTree(updatedTrees.find(tree => tree.id === editingTreeData.id) || null);
  };

  const handleDeleteTree = (treeId: string) => {
    const updatedTrees = skillTrees.filter(tree => tree.id !== treeId);
    onUpdate(updatedTrees);
    localStorage.setItem('skillTrees', JSON.stringify(updatedTrees));
    if (selectedTree?.id === treeId) {
      setSelectedTree(null);
    }
  };

  const handleCreateNode = () => {
    setNodeError(null);
    if (!selectedTree) return;
    if (!newNode.startDate) {
      setNodeError('Please select a start date.');
      return;
    }
    const node: SkillNode = {
      id: Date.now().toString(),
      name: newNode.name,
      description: newNode.description,
      category: newNode.category,
      level: newNode.level,
      dependencies: [],
      microSkills: newNode.microSkills,
      completionCriteria: newNode.completionCriteria,
      estimatedHours: newNode.estimatedHours,
      realWorldTests: [],
      startDate: newNode.startDate || new Date(),
      targetCompletionDate: newNode.targetCompletionDate || new Date(),
      milestones: [],
      schedule: {
        startDate: newNode.startDate || new Date(),
        endDate: newNode.targetCompletionDate || new Date(),
        weeklyHours: 5,
        preferredDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        preferredTimes: ['morning', 'afternoon'],
        breaks: [],
        reviewCycles: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedTree = {
      ...selectedTree,
      nodes: [...selectedTree.nodes, node],
      updatedAt: new Date()
    };

    const updatedTrees = skillTrees.map(tree => 
      tree.id === selectedTree.id ? updatedTree : tree
    );

    onUpdate(updatedTrees);
    localStorage.setItem('skillTrees', JSON.stringify(updatedTrees));
    setNewNode({
      name: '',
      description: '',
      category: '',
      level: 1,
      estimatedHours: 1,
      startDate: new Date(),
      targetCompletionDate: new Date(),
      microSkills: [],
      completionCriteria: [],
    });
    setIsCreatingNode(false);
    setSelectedTree(updatedTree);
  };

  const handleEditNode = () => {
    setNodeError(null);
    if (!selectedTree || !editingNodeData || !editingNodeData.startDate) {
      setNodeError('Please select a start date.');
      return;
    }

    const updatedNodes = selectedTree.nodes.map(node =>
      node.id === editingNodeData.id ? { ...editingNodeData, updatedAt: new Date() } : node
    );

    const updatedTree = {
      ...selectedTree,
      nodes: updatedNodes,
      updatedAt: new Date()
    };

    const updatedTrees = skillTrees.map(tree =>
      tree.id === selectedTree.id ? updatedTree : tree
    );

    onUpdate(updatedTrees);
    localStorage.setItem('skillTrees', JSON.stringify(updatedTrees));
    setIsEditingNode(false);
    setEditingNodeData(null);
    setSelectedTree(updatedTree);
  };

  const handleDeleteNode = (nodeId: string) => {
    if (!selectedTree) return;

    const updatedNodes = selectedTree.nodes.filter(node => node.id !== nodeId);

    const updatedTree = {
      ...selectedTree,
      nodes: updatedNodes,
      updatedAt: new Date()
    };

    const updatedTrees = skillTrees.map(tree =>
      tree.id === selectedTree.id ? updatedTree : tree
    );

    onUpdate(updatedTrees);
    localStorage.setItem('skillTrees', JSON.stringify(updatedTrees));
    setSelectedTree(updatedTree);
  };

  const getNodeProgress = (node: SkillNode) => {
    const totalItems = node.microSkills.length + node.completionCriteria.length;
    if (totalItems === 0) return 0;
    
    const completedItems = node.microSkills.filter(skill => 
      skill.status === 'completed'
    ).length + node.completionCriteria.filter(criteria => 
      criteria.completed
    ).length;
    
    return (completedItems / totalItems) * 100;
  };

  const getNodeStatus = (node: SkillNode) => {
    const now = new Date();
    const progress = getNodeProgress(node);
    
    if (progress === 100) return 'completed';
    if (node.targetCompletionDate && node.targetCompletionDate < now) return 'overdue';
    if (node.startDate && node.startDate <= now) return 'in-progress';
    return 'planned';
  };

  function formatDate(date: string | Date | null | undefined): string {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";
    return d.toLocaleDateString();
  }

  const getPriorityColor = (priority: SkillTree['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Skill Trees List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillTrees.map((tree) => (
          <Card 
            key={tree.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTree?.id === tree.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardHeader onClick={() => setSelectedTree(tree)}>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  {tree.name}
                </span>
                <div className="flex gap-1">
                  <Badge variant="secondary">{tree.nodes.length}</Badge>
                  <Badge className={getPriorityColor(tree.priority)}>
                    {tree.priority}
                  </Badge>
                </div>
              </CardTitle>
              <p className="text-sm text-gray-600">{tree.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress:</span>
                  <span className="font-medium">{tree.progress}%</span>
                </div>
                <Progress value={tree.progress} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium">
                    {formatDate(tree.startDate)} - {formatDate(tree.targetEndDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <Badge className={getStatusColor(tree.status)}>
                    {tree.status}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Dialog open={isEditingTree && editingTreeData?.id === tree.id} onOpenChange={setIsEditingTree}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setEditingTreeData(tree); 
                        setIsEditingTree(true); 
                      }}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Skill Tree</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={editingTreeData?.name || ''}
                          onChange={(e) => setEditingTreeData({ ...editingTreeData!, name: e.target.value })}
                          placeholder="e.g., Web Development, Data Science"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={editingTreeData?.description || ''}
                          onChange={(e) => setEditingTreeData({ ...editingTreeData!, description: e.target.value })}
                          placeholder="Describe your skill tree..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Input
                          value={editingTreeData?.category || ''}
                          onChange={(e) => setEditingTreeData({ ...editingTreeData!, category: e.target.value })}
                          placeholder="e.g., Technology, Business, Creative"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Start Date</label>
                          <Input
                            type="date"
                            value={editingTreeData?.startDate ? new Date(editingTreeData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            onChange={(e) => setEditingTreeData({ 
                              ...editingTreeData!, 
                              startDate: e.target.value ? new Date(e.target.value) : new Date()
                            })}
                            placeholder="Select start date"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Target End Date</label>
                          <Input
                            type="date"
                            value={editingTreeData?.targetEndDate ? new Date(editingTreeData.targetEndDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                            onChange={(e) => setEditingTreeData({ 
                              ...editingTreeData!, 
                              targetEndDate: e.target.value ? new Date(e.target.value) : new Date()
                            })}
                            placeholder="Select end date"
                          />
                        </div>
                      </div>
                      {treeError && <div className="text-red-600 text-sm mt-2">{treeError}</div>}
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select 
                          value={editingTreeData?.priority || 'medium'} 
                          onValueChange={(value: any) => setEditingTreeData({ ...editingTreeData!, priority: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleEditTree} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDeleteTree(tree.id); 
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Tree Card */}
        <Dialog open={isCreatingTree} onOpenChange={setIsCreatingTree}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer border-dashed hover:border-blue-500 transition-colors">
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Create New Skill Tree</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Skill Tree</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newTree.name}
                  onChange={(e) => setNewTree({ ...newTree, name: e.target.value })}
                  placeholder="e.g., Web Development, Data Science"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTree.description}
                  onChange={(e) => setNewTree({ ...newTree, description: e.target.value })}
                  placeholder="Describe your skill tree..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={newTree.category}
                  onChange={(e) => setNewTree({ ...newTree, category: e.target.value })}
                  placeholder="e.g., Technology, Business, Creative"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={newTree.startDate ? newTree.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewTree({ 
                      ...newTree, 
                      startDate: e.target.value ? new Date(e.target.value) : new Date()
                    })}
                    placeholder="Select start date"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Target End Date</label>
                  <Input
                    type="date"
                    value={newTree.targetEndDate ? newTree.targetEndDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewTree({ 
                      ...newTree, 
                      targetEndDate: e.target.value ? new Date(e.target.value) : new Date()
                    })}
                    placeholder="Select end date"
                  />
                </div>
              </div>
              {treeError && <div className="text-red-600 text-sm mt-2">{treeError}</div>}
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select 
                  value={newTree.priority} 
                  onValueChange={(value: any) => setNewTree({ ...newTree, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateTree} className="w-full">
                Create Skill Tree
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected Tree Details */}
      {selectedTree && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                {selectedTree.name} - Skill Nodes
              </span>
              <Dialog open={isCreatingNode} onOpenChange={setIsCreatingNode}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill Node
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Skill Node</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Skill Name</label>
                      <Input
                        value={newNode.name}
                        onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                        placeholder="e.g., JavaScript Fundamentals"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newNode.description}
                        onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
                        placeholder="Describe this skill..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Level</label>
                        <Select 
                          value={newNode.level.toString()} 
                          onValueChange={(value) => setNewNode({ ...newNode, level: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                              <SelectItem key={level} value={level.toString()}>
                                Level {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Hours</label>
                        <Input
                          type="number"
                          value={newNode.estimatedHours}
                          onChange={(e) => setNewNode({ ...newNode, estimatedHours: parseInt(e.target.value) || 1 })}
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Input
                          type="date"
                          value={newNode.startDate ? newNode.startDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                          onChange={(e) => setNewNode({ 
                            ...newNode, 
                            startDate: e.target.value ? new Date(e.target.value) : new Date()
                          })}
                          placeholder="Select start date"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Target Completion</label>
                        <Input
                          type="date"
                          value={newNode.targetCompletionDate ? newNode.targetCompletionDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                          onChange={(e) => setNewNode({ 
                            ...newNode, 
                            targetCompletionDate: e.target.value ? new Date(e.target.value) : new Date()
                          })}
                          placeholder="Select target completion date"
                        />
                      </div>
                    </div>

                    {/* Micro-skills Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Micro-skills</label>
                      {newNode.microSkills.map((ms, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            value={ms.name}
                            onChange={(e) => {
                              const updatedMs = [...newNode.microSkills];
                              updatedMs[idx].name = e.target.value;
                              setNewNode({ ...newNode, microSkills: updatedMs });
                            }}
                            placeholder="Micro-skill name"
                          />
                          <Select
                            value={ms.difficulty}
                            onValueChange={(value: any) => {
                              const updatedMs = [...newNode.microSkills];
                              updatedMs[idx].difficulty = value;
                              setNewNode({ ...newNode, microSkills: updatedMs });
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" onClick={() => {
                            setNewNode({ ...newNode, microSkills: newNode.microSkills.filter((_, i) => i !== idx) });
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="secondary" size="sm" onClick={() => {
                        setNewNode({ 
                          ...newNode, 
                          microSkills: [...newNode.microSkills, { 
                            id: Date.now().toString(), 
                            name: '', 
                            description: '', 
                            difficulty: 'beginner', 
                            timeEstimate: 0, 
                            practiceProtocols: [], 
                            selfTests: [], 
                            masteryIndicators: [], 
                            startDate: new Date(), 
                            targetDate: new Date(), 
                            status: 'not-started', 
                            progress: 0 
                          }]
                        });
                      }}>
                        <Plus className="w-4 h-4 mr-1" /> Add Micro-skill
                      </Button>
                    </div>

                    {/* Completion Criteria Section */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Completion Criteria</label>
                      {newNode.completionCriteria.map((cc, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <Input
                            value={cc.description}
                            onChange={(e) => {
                              const updatedCc = [...newNode.completionCriteria];
                              updatedCc[idx].description = e.target.value;
                              setNewNode({ ...newNode, completionCriteria: updatedCc });
                            }}
                            placeholder="Criteria description"
                          />
                          <Select
                            value={cc.type}
                            onValueChange={(value: any) => {
                              const updatedCc = [...newNode.completionCriteria];
                              updatedCc[idx].type = value;
                              setNewNode({ ...newNode, completionCriteria: updatedCc });
                            }}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="performance">Performance</SelectItem>
                              <SelectItem value="knowledge">Knowledge</SelectItem>
                              <SelectItem value="application">Application</SelectItem>
                              <SelectItem value="teaching">Teaching</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" onClick={() => {
                            setNewNode({ ...newNode, completionCriteria: newNode.completionCriteria.filter((_, i) => i !== idx) });
                          }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="secondary" size="sm" onClick={() => {
                        setNewNode({ 
                          ...newNode, 
                          completionCriteria: [...newNode.completionCriteria, { 
                            id: Date.now().toString(), 
                            description: '', 
                            type: 'performance', 
                            threshold: 0, 
                            measurement: 'accuracy', 
                            evidenceRequired: false, 
                            targetDate: new Date(), 
                            completed: false 
                          }]
                        });
                      }}>
                        <Plus className="w-4 h-4 mr-1" /> Add Criteria
                      </Button>
                    </div>

                    {nodeError && <div className="text-red-600 text-sm mt-2">{nodeError}</div>}
                    <Button onClick={handleCreateNode} className="w-full">
                      Add Skill Node
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTree.nodes.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">No skill nodes created yet</p>
                <p className="text-sm text-gray-500">Start by adding your first skill node</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedTree.nodes.map((node) => {
                  const status = getNodeStatus(node);
                  const progress = getNodeProgress(node);
                  
                  return (
                    <div key={node.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium flex items-center gap-2">
                            {node.name}
                            <Badge variant="outline">Level {node.level}</Badge>
                            <Badge className={getStatusColor(status)}>
                              {status}
                            </Badge>
                            {status === 'overdue' && (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{node.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog open={isEditingNode && editingNodeData?.id === node.id} onOpenChange={setIsEditingNode}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setEditingNodeData(node); 
                                  setIsEditingNode(true); 
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Skill Node</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Skill Name</label>
                                  <Input
                                    value={editingNodeData?.name || ''}
                                    onChange={(e) => setEditingNodeData({ ...editingNodeData!, name: e.target.value })}
                                    placeholder="e.g., JavaScript Fundamentals"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <Textarea
                                    value={editingNodeData?.description || ''}
                                    onChange={(e) => setEditingNodeData({ ...editingNodeData!, description: e.target.value })}
                                    placeholder="Describe this skill..."
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Level</label>
                                    <Select 
                                      value={editingNodeData?.level.toString() || '1'} 
                                      onValueChange={(value) => setEditingNodeData({ ...editingNodeData!, level: parseInt(value) })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                                          <SelectItem key={level} value={level.toString()}>
                                            Level {level}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Hours</label>
                                    <Input
                                      type="number"
                                      value={editingNodeData?.estimatedHours}
                                      onChange={(e) => setEditingNodeData({ ...editingNodeData!, estimatedHours: parseInt(e.target.value) || 1 })}
                                      min="1"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Start Date</label>
                                    <Input
                                      type="date"
                                      value={editingNodeData?.startDate ? new Date(editingNodeData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                      onChange={(e) => setEditingNodeData({ 
                                        ...editingNodeData!, 
                                        startDate: e.target.value ? new Date(e.target.value) : new Date()
                                      })}
                                      placeholder="Select start date"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Target Completion</label>
                                    <Input
                                      type="date"
                                      value={editingNodeData?.targetCompletionDate ? new Date(editingNodeData.targetCompletionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                      onChange={(e) => setEditingNodeData({ 
                                        ...editingNodeData!, 
                                        targetCompletionDate: e.target.value ? new Date(e.target.value) : new Date()
                                      })}
                                      placeholder="Select target completion date"
                                    />
                                  </div>
                                </div>

                                {/* Micro-skills Section */}
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Micro-skills</label>
                                  {editingNodeData?.microSkills.map((ms, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                      <Input
                                        value={ms.name}
                                        onChange={(e) => {
                                          const updatedMs = [...(editingNodeData?.microSkills || [])];
                                          updatedMs[idx].name = e.target.value;
                                          setEditingNodeData({ ...editingNodeData!, microSkills: updatedMs });
                                        }}
                                        placeholder="Micro-skill name"
                                      />
                                      <Select
                                        value={ms.difficulty}
                                        onValueChange={(value: any) => {
                                          const updatedMs = [...(editingNodeData?.microSkills || [])];
                                          updatedMs[idx].difficulty = value;
                                          setEditingNodeData({ ...editingNodeData!, microSkills: updatedMs });
                                        }}
                                      >
                                        <SelectTrigger className="w-[120px]">
                                          <SelectValue placeholder="Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="beginner">Beginner</SelectItem>
                                          <SelectItem value="intermediate">Intermediate</SelectItem>
                                          <SelectItem value="advanced">Advanced</SelectItem>
                                          <SelectItem value="expert">Expert</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button variant="outline" size="sm" onClick={() => {
                                        setEditingNodeData({ ...editingNodeData!, microSkills: (editingNodeData?.microSkills || []).filter((_, i) => i !== idx) });
                                      }}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button type="button" variant="secondary" size="sm" onClick={() => {
                                    setEditingNodeData({ 
                                      ...editingNodeData!, 
                                      microSkills: [...(editingNodeData?.microSkills || []), { 
                                        id: Date.now().toString(), 
                                        name: '', 
                                        description: '', 
                                        difficulty: 'beginner', 
                                        timeEstimate: 0, 
                                        practiceProtocols: [], 
                                        selfTests: [], 
                                        masteryIndicators: [], 
                                        startDate: new Date(), 
                                        targetDate: new Date(), 
                                        status: 'not-started', 
                                        progress: 0 
                                      }]
                                    });
                                  }}>
                                    <Plus className="w-4 h-4 mr-1" /> Add Micro-skill
                                  </Button>
                                </div>

                                {/* Completion Criteria Section */}
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Completion Criteria</label>
                                  {editingNodeData?.completionCriteria.map((cc, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                      <Input
                                        value={cc.description}
                                        onChange={(e) => {
                                          const updatedCc = [...(editingNodeData?.completionCriteria || [])];
                                          updatedCc[idx].description = e.target.value;
                                          setEditingNodeData({ ...editingNodeData!, completionCriteria: updatedCc });
                                        }}
                                        placeholder="Criteria description"
                                      />
                                      <Select
                                        value={cc.type}
                                        onValueChange={(value: any) => {
                                          const updatedCc = [...(editingNodeData?.completionCriteria || [])];
                                          updatedCc[idx].type = value;
                                          setEditingNodeData({ ...editingNodeData!, completionCriteria: updatedCc });
                                        }}
                                      >
                                        <SelectTrigger className="w-[120px]">
                                          <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="performance">Performance</SelectItem>
                                          <SelectItem value="knowledge">Knowledge</SelectItem>
                                          <SelectItem value="application">Application</SelectItem>
                                          <SelectItem value="teaching">Teaching</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button variant="outline" size="sm" onClick={() => {
                                        setEditingNodeData({ ...editingNodeData!, completionCriteria: (editingNodeData?.completionCriteria || []).filter((_, i) => i !== idx) });
                                      }}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button type="button" variant="secondary" size="sm" onClick={() => {
                                    setEditingNodeData({ 
                                      ...editingNodeData!, 
                                      completionCriteria: [...(editingNodeData?.completionCriteria || []), { 
                                        id: Date.now().toString(), 
                                        description: '', 
                                        type: 'performance', 
                                        threshold: 0, 
                                        measurement: 'accuracy', 
                                        evidenceRequired: false, 
                                        targetDate: new Date(), 
                                        completed: false 
                                      }]
                                    });
                                  }}>
                                    <Plus className="w-4 h-4 mr-1" /> Add Criteria
                                  </Button>
                                </div>

                                {nodeError && <div className="text-red-600 text-sm mt-2">{nodeError}</div>}
                                <Button onClick={handleEditNode} className="w-full">
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleDeleteNode(node.id); 
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{progress.toFixed(0)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{node.estimatedHours}h</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-gray-400" />
                            <span>{node.microSkills.length} micro-skills</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-gray-400" />
                            <span>{node.completionCriteria.length} criteria</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">Progress:</span>
                            <span className="font-medium">{getNodeProgress(node).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillTreeBuilder; 