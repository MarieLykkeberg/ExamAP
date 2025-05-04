import { Injectable } from '@angular/core';

export interface Brand {
    brandId: number;
    brandName: string;
  }

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:5196/api/brand';

  constructor() {}

  // GET: Fetch all brands
  async getBrands(): Promise<Brand[]> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }

    return await response.json();
  }

  // POST: Add a new brand
  async addBrand(name: string): Promise<void> {
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
      throw new Error('Failed to add brand: ' + response.statusText);
    }
  }
}