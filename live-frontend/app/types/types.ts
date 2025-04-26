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

export interface ExperienceRequest {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
  activities?: ActivityRequest[];
  photo?: string;
};

export interface ExperienceResponse {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  visibility: string;
  activities: any[];
  username: string;
  createdAt: Date;
  updatedAt: Date;
  photoUrl: string;
};

export interface UserResponse {
  id: string;
  username: string;
  fullName: string;
  profilePicture: string;
}

export interface ShareExperienceRequest {
  experienceId: number;
  sharedWithUserIds: string[];
}
