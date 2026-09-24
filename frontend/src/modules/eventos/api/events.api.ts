import { api } from '@/shared/lib/api';
import type {
  PublicEvent,
  CreateFeedbackPayload,
  FeedbackSummary,
} from '@/shared/types/event.types';

export const eventsApi = {
  async getPublicEvent(code: string): Promise<PublicEvent> {
    const response = await api.get<PublicEvent>(`/events/public/${code}`);
    return response.data;
  },

  async submitFeedback(
    code: string,
    payload: CreateFeedbackPayload,
  ): Promise<{ success: boolean; message: string; feedbackId: string }> {
    const response = await api.post<{ success: boolean; message: string; feedbackId: string }>(
      `/events/public/${code}/feedback`,
      payload,
    );
    return response.data;
  },

  async getFeedbackSummary(workspaceId: string): Promise<FeedbackSummary> {
    const response = await api.get<FeedbackSummary>(`/events/${workspaceId}/feedback-summary`);
    return response.data;
  },
};
