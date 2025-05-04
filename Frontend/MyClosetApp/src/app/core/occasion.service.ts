import { Injectable } from '@angular/core';

export interface Occasion {
    occasionId: number;
    occasionName: string;
  }

@Injectable({
  providedIn: 'root'
})
export class OccasionService {
  private apiUrl = 'http://localhost:5196/api/occasion';

  constructor() {}

  // GET: Fetch all occasions
  async getOccasions(): Promise<Occasion[]> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch occasions');
    }

    return await response.json();
  }

  // POST: Add a new occasion
  async addOccasion(name: string): Promise<void> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error('Failed to add occasion: ' + response.statusText);
    }
  }
}