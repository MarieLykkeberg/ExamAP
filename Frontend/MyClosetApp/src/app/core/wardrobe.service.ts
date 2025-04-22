import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WardrobeService {
  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5196/api/item');
  }

  getCategories(): Observable<{ categoryId: number, categoryName: string }[]> {
    return this.http.get<{ categoryId: number, categoryName: string }[]>('http://localhost:5196/api/category');
  }
}