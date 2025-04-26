import { ActivityResponse} from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api';

export async function initSchedule(body: string): Promise<ActivityResponse[]> {
  const res = await fetch(`${API_BASE_URL}/assistant/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Init failed');
  return res.json();
}

export async function refineSchedule(body: string): Promise<ActivityResponse[]> {
  const res = await fetch(`${API_BASE_URL}/assistant/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Refine failed');
  return res.json();
}
