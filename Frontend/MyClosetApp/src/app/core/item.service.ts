import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  private getAuthHeaders(): HttpHeaders {
    const authHeader = localStorage.getItem('authHeader');
    return new HttpHeaders({
      'Authorization': authHeader || ''
    });
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item, { headers: this.getAuthHeaders() });
  }

  updateItem(id: number, item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${id}`, item, { headers: this.getAuthHeaders() });
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  uploadImage(formData: FormData): Observable<string> {
    return this.http.post<{ imageUrl: string }>('http://localhost:5196/api/upload-image', formData)
      .pipe(map(res => res.imageUrl));
  }

  addLookup(kind: 'category'|'color'|'material'|'brand'|'occasion', name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${kind}`, { name });
  }
}