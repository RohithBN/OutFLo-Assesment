import axios from 'axios';
import { Campaign, CreateCampaignData, UpdateCampaignData, LinkedInProfile, PersonalizedMessageResponse, ApiResponse } from '../types';



const api = axios.create({
  baseURL: "/api",
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const campaignApi = {
  
  getAll: async (): Promise<Campaign[]> => {
    const response = await api.get<ApiResponse<Campaign[]>>('/campaigns');
    return response.data.data || [];
  },

  getById: async (id: string): Promise<Campaign> => {
    const response = await api.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
    if (!response.data.data) {
      throw new Error('Campaign not found');
    }
    return response.data.data;
  },

  
  create: async (data: CreateCampaignData): Promise<Campaign> => {
    const response = await api.post<ApiResponse<Campaign>>('/campaigns', data);
    if (!response.data.data) {
      throw new Error('Failed to create campaign');
    }
    return response.data.data;
  },

  
  update: async (id: string, data: UpdateCampaignData): Promise<Campaign> => {
    const response = await api.put<ApiResponse<Campaign>>(`/campaigns/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update campaign');
    }
    return response.data.data;
  },

  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/campaigns/${id}`);
  },
};


export const messageApi = {
  
  generatePersonalized: async (profile: LinkedInProfile): Promise<PersonalizedMessageResponse> => {
    const response = await api.post<PersonalizedMessageResponse>('/personalized-message', profile);
    return response.data;
  },
};

export default api;
