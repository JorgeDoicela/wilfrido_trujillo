export interface EventResource {
  id: string;
  title: string;
  fileType: string;
  isLocked: boolean;
  downloadUrl: string;
}

export interface PublicEvent {
  id: string;
  title: string;
  description: string | null;
  type: string;
  accessCode: string;
  createdAt: string;
  resources: EventResource[];
}

export interface CreateFeedbackPayload {
  attendeeName: string;
  attendeeEmail: string;
  attendeeIdentification?: string;
  rating: number;
  clarityRating: number;
  applicableRating: number;
  comments?: string;
}

export interface EventFeedbackItem {
  id: string;
  attendeeName: string;
  rating: number;
  clarityRating: number;
  applicableRating: number;
  comments: string | null;
  createdAt: string;
}

export interface FeedbackSummary {
  totalResponses: number;
  averageRating: number;
  averageClarity: number;
  averageApplicable: number;
  feedbacks: EventFeedbackItem[];
}
