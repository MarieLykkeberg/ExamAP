import { Injectable } from '@angular/core';

export interface Color {
  colorId: number;
  colorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = 'http://localhost:5196/api/color';

  constructor() {}

  // GET: Fetch all colors
  async getColors(): Promise<Color[]> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch colors');
    }

    return await response.json();
  }

  // POST: Add a new color
  async addColor(name: string): Promise<void> {
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
      throw new Error('Failed to add color: ' + response.statusText);
    }
  }
}