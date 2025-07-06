import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserQuiz } from '@/types/user';
import { QuizQuestion } from '@/types/quiz';
import { toast } from 'sonner';
import StorageManager from '@/utils/storageManager';
import { 
  Plus, 
  Play, 
  Edit, 
  Trash2, 
  Clock, 
  BookOpen, 
  Target,
  Calendar,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface QuizDashboardProps {
  onStartQuiz: (questions: QuizQuestion[]) => void;
  onCreateQuiz: () => void;
}

export interface QuizDashboardRef {
  refreshQuizzes: () => void;
}

const QuizDashboard = forwardRef<QuizDashboardRef, QuizDashboardProps>(({ onStartQuiz, onCreateQuiz }, ref) => {
  const [quizzes, setQuizzes] = useState<UserQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [quizBeingEdited, setQuizBeingEdited] = useState<UserQuiz | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editQuestions, setEditQuestions] = useState<any[]>([]);
  const [editJson, setEditJson] = useState('');

  useEffect(() => {
    console.log('📊 [DEBUG] QuizDashboard mounted');
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    console.log('📚 [DEBUG] Loading quizzes from storage...');
    setLoading(true);
    try {
      const userQuizzes = await StorageManager.getQuizzes();
      console.log('📚 [DEBUG] Loaded quizzes:', userQuizzes);
      console.log('📚 [DEBUG] Quizzes count:', userQuizzes.length);
      setQuizzes(userQuizzes);
    } catch (error) {
      console.error('❌ [DEBUG] Failed to load quizzes:', error);
      toast.error('Failed to load your quizzes');
    } finally {
      setLoading(false);
      console.log('📚 [DEBUG] Finished loading quizzes');
    }
  };

  const handleStartQuiz = (quiz: UserQuiz) => {
    console.log('🎮 [DEBUG] Starting quiz:', quiz.title);
    // Convert UserQuiz to legacy QuizQuestion format for compatibility
    const legacyQuestions: QuizQuestion[] = quiz.questions.map(q => ({
      question: q.question,
      options: q.options,
      answer: q.answer,
      type: q.type,
    }));
    
    onStartQuiz(legacyQuestions);
    toast.success(`Starting "${quiz.title}"! 🚀`);
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    console.log('🗑️ [DEBUG] Attempting to delete quiz:', quizTitle);
    if (!confirm(`Are you sure you want to delete "${quizTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await StorageManager.deleteQuiz(quizId);
      console.log('✅ [DEBUG] Quiz deleted successfully');
      await loadQuizzes(); // Refresh the list
      toast.success(`"${quizTitle}" has been deleted`);
    } catch (error) {
      console.error('❌ [DEBUG] Failed to delete quiz:', error);
      toast.error('Failed to delete quiz');
    }
  };

  const handleEditQuiz = (quiz: UserQuiz) => {
    setQuizBeingEdited(quiz);
    setEditTitle(quiz.title);
    setEditDescription(quiz.description || '');
    setEditQuestions(quiz.questions.map(q => ({ ...q, options: q.options ? [...q.options] : [] })));
    setEditJson(JSON.stringify(quiz, null, 2));
    setEditModalOpen(true);
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(quizzes.map(q => q.category).filter(Boolean)));

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  // Expose the refresh method via ref
  useImperativeHandle(ref, () => ({
    refreshQuizzes: () => {
      console.log('🔄 [DEBUG] Refreshing quizzes list via ref');
      loadQuizzes();
    }
  }));

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
          <p className="text-gray-600 mt-1">
            {quizzes.length} quiz{quizzes.length !== 1 ? 'es' : ''} in your library
          </p>
        </div>
        
        <Button onClick={onCreateQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Create New Quiz
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center border border-gray-200 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="p-2"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="p-2"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quiz Grid/List */}
      {filteredQuizzes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || selectedCategory !== 'all' ? 'No quizzes found' : 'No quizzes yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first quiz to get started with AI-powered learning'
              }
            </p>
            {(!searchTerm && selectedCategory === 'all') && (
              <Button onClick={onCreateQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Quiz
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className={`group hover:shadow-lg transition-all duration-200 ${
              viewMode === 'list' ? 'flex flex-row' : ''
            }`}>
              <CardHeader className={viewMode === 'list' ? 'flex-1 pb-4' : ''}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {quiz.title}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {quiz.description || 'No description available'}
                    </p>
                  </div>
                  {quiz.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className={`space-y-4 ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
                {/* Quiz Stats */}
                <div className={`flex gap-4 text-sm text-gray-600 ${viewMode === 'list' ? 'flex-col gap-2' : ''}`}>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    <span>{quiz.questions.length} questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(quiz.estimatedDuration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Tags */}
                {quiz.tags && quiz.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {quiz.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {quiz.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{quiz.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-col min-w-[120px]' : ''}`}>
                  <Button 
                    onClick={() => handleStartQuiz(quiz)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="p-2" onClick={() => handleEditQuiz(quiz)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Quiz (JSON)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <label className="block text-sm font-medium">Quiz JSON</label>
            <Textarea
              value={editJson}
              onChange={e => setEditJson(e.target.value)}
              rows={20}
              className="font-mono text-xs"
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setEditModalOpen(false)} className="bg-blue-600 text-white">Save (Not Implemented)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default QuizDashboard; 