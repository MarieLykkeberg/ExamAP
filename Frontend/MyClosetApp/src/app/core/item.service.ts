import { Injectable } from '@angular/core';

export interface Item {
    itemId?: number;
    categoryId: number | null;
    colorId: number | null;
    materialId: number | null;
    brandName: string;
    occasionId: number | null;
    isFavorite: boolean;
    purchaseDate: string;
    imageUrl: string;
  }

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:5196/api/item';

  constructor() {}

  //Add new item for logged-in user
  async addItem(item: Item): Promise<void> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      throw new Error('Failed to add item: ' + response.statusText);
    }
  }

  // Get items for current user
  async getItems(): Promise<Item[]> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(this.apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch items: ' + response.statusText);
    }

    return await response.json();
  }

  // delete item
  async deleteItem(itemId: number): Promise<void> {
    const authHeader = localStorage.getItem('authHeader');

    const response = await fetch(`${this.apiUrl}/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || ''
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  }
}