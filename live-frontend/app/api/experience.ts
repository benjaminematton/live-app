import { ExperienceRequest} from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api';

export async function createExperience(body: string): Promise<ExperienceRequest[]> {
  const res = await fetch(`${API_BASE_URL}/experience/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
}

export async function getExperience(id: string): Promise<ExperienceRequest[]> {
  const res = await fetch(`${API_BASE_URL}/experience/${id}`, {
    method: 'GET',
  });
  if (!res.ok) throw new Error('Get failed');
  return res.json();
}