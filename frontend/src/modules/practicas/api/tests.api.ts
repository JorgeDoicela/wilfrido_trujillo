import { api } from '@/shared/lib/api';
import type { Test, TestResult, CreateTestPayload } from '@/shared/types/test.types';

export const testsApi = {
  async getByWorkspace(workspaceId: string): Promise<Test | null> {
    const response = await api.get<Test | null>(`/tests/workspace/${workspaceId}`);
    return response.data;
  },

  async submit(testId: string, answers: Record<string, number>): Promise<TestResult> {
    const response = await api.post<TestResult>(`/tests/${testId}/submit`, { answers });
    return response.data;
  },

  async create(payload: CreateTestPayload): Promise<Test> {
    const response = await api.post<Test>('/tests', payload);
    return response.data;
  },
};
