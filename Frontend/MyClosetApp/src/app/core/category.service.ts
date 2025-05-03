import { Injectable } from '@angular/core';

export interface Category {
  categoryId: number;  
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5196/api/category'; 

  constructor() {}

  async getCategories(): Promise<Category[]> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch: ' + response.statusText);
    }

    return await response.json();
  }
}