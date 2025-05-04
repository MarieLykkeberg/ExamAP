import { Injectable } from '@angular/core';

export interface Material {
    materialId: number;
    materialName: string;
  }

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:5196/api/material';

  constructor() {}

  // GET: Fetch all materials
  async getMaterials(): Promise<Material[]> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }

    return await response.json();
  }

  // POST: Add a new material
  async addMaterial(name: string): Promise<void> {
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
      throw new Error('Failed to add material: ' + response.statusText);
    }
  }
}