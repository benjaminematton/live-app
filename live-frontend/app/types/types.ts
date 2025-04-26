type Role = 'user' | 'assistant';

export interface ChatMsg {
  id: string;
  role: Role;
  text?: string;         
  activities?: ActivityResponse[]; 
}

export interface ActivityResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: Date;     
}

export interface ActivityDraft {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
}

export interface ActivityRequest {
  title: string;
  description: string;
  location: string;
  startTime: Date;     
}

export type ExperienceRequest = {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
  activities?: ActivityRequest[];
  photo?: {
    uri: string;
    name: string;
    type: string;
  };
};

export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
}