import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
    categoryId: number;
    categoryName: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://localhost:5196/api/category';

    constructor(private http: HttpClient) { }

  // GET: all categories
  getCategories(): Observable<Category[]> {
    const authHeader = localStorage.getItem('authHeader') || '';

    const headers = new HttpHeaders({
      'Authorization': authHeader
    });

    return this.http.get<Category[]>(this.apiUrl, { headers });
}
}