export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex?: number;
}

export interface Test {
  id: string;
  workspaceId: string;
  title: string;
  passingScore: number;
  timeLimitMinutes: number | null;
  questions: TestQuestion[];
}

export interface TestResult {
  attemptId: string;
  scoreObtained: number;
  passingScore: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
}

export interface CreateTestPayload {
  workspaceId: string;
  title: string;
  passingScore?: number;
  timeLimitMinutes?: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctOptionIndex: number;
  }[];
}
