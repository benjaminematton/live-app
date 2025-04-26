import { ExperienceRequest, ExperienceResponse, ShareExperienceRequest, UserResponse } from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api';

export async function createExperience(body: ExperienceRequest): Promise<ExperienceResponse> {
  const res = await fetch(`${API_BASE_URL}/experience/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
}

export async function getExperience(id: string): Promise<ExperienceResponse> {
  const res = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Get failed');
  return res.json();
}

export async function shareExperience(body: ShareExperienceRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/experience/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Share failed');
}