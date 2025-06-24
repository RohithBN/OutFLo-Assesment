export interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  leads: string[];
  accountIDs: string[];
  leadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignData {
  name: string;
  description: string;
  leads?: string[];
  accountIDs?: string[];
}

export interface UpdateCampaignData {
  name?: string;
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  leads?: string[];
  accountIDs?: string[];
}

export interface LinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export interface PersonalizedMessageResponse {
  success: boolean;
  message: string;
  source?: 'ai' | 'template' | 'fallback';
  note?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
  message?: string;
}
