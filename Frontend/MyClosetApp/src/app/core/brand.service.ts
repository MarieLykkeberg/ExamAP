import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Brand {
    brandId: number;
    brandName: string;
  }

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private apiUrl = 'http://localhost:5196/api/brand';

  constructor(private http: HttpClient) {}

  // GET: all brands
  getBrands(): Observable<Brand[]> {
    const authHeader = localStorage.getItem('authHeader') || '';

    const headers = new HttpHeaders({
      'Authorization': authHeader
    });

    return this.http.get<Brand []>(this.apiUrl, { headers });
}
}