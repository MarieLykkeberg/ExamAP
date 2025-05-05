import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

  //Add new item for logged-in user
  async addItem(item: Item): Promise<void> {
    const authHeader = localStorage.getItem('authHeader');

    const headers = new HttpHeaders({
      'Authorization': authHeader || '',
      /* 'Content-Type': 'application/json' */
    });
    this.http.post(this.apiUrl, item, { headers }).subscribe(
      // handle response
      // handle error
    );
  }

  // Get items for current user
  async getItems(): Promise<Item[]> {
    const authHeader = localStorage.getItem('authHeader');

    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });
    const response = await this.http.get<Item[]>(this.apiUrl, { headers }).toPromise();

    if (!response) {
      throw new Error('Failed to fetch items');
    }

    return response;
  }

  // delete item
  async deleteItem(itemId: number): Promise<void> {
    const authHeader = localStorage.getItem('authHeader');

    const headers = new HttpHeaders({
      'Authorization': authHeader || ''
    });
    const response = await this.http.delete(`${this.apiUrl}/${itemId}`, { headers }).toPromise();

    if (!response) {
      throw new Error('Failed to delete item');
    }
  }
}