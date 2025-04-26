import { UserResponse } from '../types/types';

const API_BASE_URL = 'http://localhost:8080/api';

export async function getFollowers(token: string): Promise<UserResponse[]> {
    const res = await fetch(`${API_BASE_URL}/followers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
  
    if (!res.ok) {
      throw new Error('Failed to fetch followers');
    }
    return res.json(); 
  }

export async function getFriends(token: string, query?: string): Promise<UserResponse[]> {
    const res = await fetch(`${API_BASE_URL}/friends?query=${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch friends');
    }
    return res.json();
}