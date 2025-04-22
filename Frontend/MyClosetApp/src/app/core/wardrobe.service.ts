import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WardrobeService {
  private baseUrl = 'http://localhost:5196/api'; 

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/item`);
  }
  }
/* 
  getBottoms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/bottom`);
  }

  getFootwear(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/footwear`);
  }
} */
