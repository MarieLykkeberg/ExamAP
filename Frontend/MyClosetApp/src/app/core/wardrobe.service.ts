// src/app/core/wardrobe.service.ts

import { Injectable } from '@angular/core';
import { HttpClient }   from '@angular/common/http';
import { Observable }   from 'rxjs';
import { map } from 'rxjs/operators';

// ——— Your data models ———
export interface Item {
purchaseDate: any;
  itemId:     number;
  imageUrl:   string;
  colorId:    number;
  categoryId:  number;
  materialId: number;
  brandId:    number;
  occasionId: number;
  isFavorite: boolean;
  // (…plus any other fields you use…)
}

export interface Category  { categoryId: number; categoryName: string; }
export interface Color     { colorId:    number; colorName:    string; }
export interface Material  { materialId: number; materialName: string; }
export interface Brand     { brandId:    number; brandName:    string; }
export interface Occasion  { occasionId: number; occasionName: string; }

@Injectable({
  providedIn: 'root'
})
export class WardrobeService {
  // single base URL for all your API calls
  private apiUrl = 'http://localhost:5196/api';

  constructor(private http: HttpClient) {}

  // ——— Items CRUD ———

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/item`);
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/item/${id}`);
  }

  updateItem(item: Item): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/item/${item.itemId}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${id}`);
  }

  // ——— Lookup lists for your dropdowns ———

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/category`);
  }

  getColors(): Observable<Color[]> {
    return this.http.get<Color[]>(`${this.apiUrl}/color`);
  }

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/material`);
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brand`);
  }

  getOccasions(): Observable<Occasion[]> {
    return this.http.get<Occasion[]>(`${this.apiUrl}/occasion`);
  }

  uploadImage(formData: FormData): Observable<string> {
    return this.http.post<{ imageUrl: string }>('http://localhost:5196/api/upload-image', formData)
      .pipe(map(res => res.imageUrl));
  }
}