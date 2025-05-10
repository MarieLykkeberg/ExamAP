import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Material {
    materialId: number;
    materialName: string;
  }

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:5196/api/material';

  constructor(private http: HttpClient) {}

  getMaterials(): Observable<Material[]> {
    const authHeader = localStorage.getItem('authHeader') || '';

    const headers = new HttpHeaders({
      'Authorization': authHeader
    });

    return this.http.get<Material []>(this.apiUrl, { headers });
}
}