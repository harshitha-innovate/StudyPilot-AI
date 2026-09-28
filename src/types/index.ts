export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type AgentAction =
  | 'MOVE_TO_NEXT_TOPIC'
  | 'GENERATE_ANOTHER_QUESTION'
  | 'START_REVISION'
  | 'GIVE_CONCEPT_EXPLANATION'
  | 'LOWER_DIFFICULTY'
  | 'INCREASE_DIFFICULTY'
  | 'START_MOCK_TEST';

export interface PlanTimelineItem {
  id: string;
  time: string;
  topic: string;
  priority: PriorityLevel;
  activity: string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  completed: boolean;
  agentReasoning: string;
}

export interface StudyPlan {
  subject: string;
  examDate: string;
  availableHours: number;
  targetScore: number;
  difficulty: DifficultyLevel;
  learningGoal: string;
  summary: string;
  strategy: string;
  timeline: PlanTimelineItem[];
  agentNotes: string;
  createdAt: string;
}

export interface PracticeQuestion {
  id: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionText: string;
  hint: string;
  keyConcepts: string[];
  sampleAnswer: string;
}

export interface AnswerEvaluation {
  score: number; // 0 to 10
  isCorrect: boolean;
  correctFinalAnswer: boolean;
  correctReasoning: boolean;
  reasoningAnalysis: string;
  minorIssues: string | null;
  missingConcepts: string[];
  commonMistakes: string[];
  conceptUnderstanding: 'Strong' | 'Moderate' | 'Needs Improvement';
  nextAction: AgentAction;
  nextActionReasoning: string;
  recommendedAction: string;
  aiRecommendation: string;
  modelSolution: string;
}

export interface AgentActivityEvent {
  id: string;
  timestamp: string;
  title: string;
  action: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  category: 'analysis' | 'planning' | 'evaluation' | 'decision' | 'adaptation';
  badgeColor?: string;
}

export interface StudentState {
  name: string;
  subject: string;
  examDate: string;
  availableHours: number;
  targetScore: number;
  currentScore: number;
  streakDays: number;
  studyHours: number;
  topicsMastered: number;
  currentTopic: string;
  currentDifficulty: DifficultyLevel;
  selectedTopics: string[];
  weakTopics: string[];
  strongTopics: string[];
  recentScores: number[];
  recommendation: {
    title: string;
    action: AgentAction;
    actionLabel: string;
    reason: string;
    estimatedMinutes: number;
    topic: string;
  };
}

export interface WeeklyStudyDay {
  day: string;
  shortDay: string;
  hours: number;
  questions: number;
  score: number;
}
